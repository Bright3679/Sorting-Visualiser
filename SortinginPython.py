import tkinter as tk
from tkinter import ttk
import matplotlib.pyplot as plt
import matplotlib.animation as animation
import numpy as np
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
import ctypes

try:
    ctypes.windll.shcore.SetProcessDpiAwareness(1)
except:
    ctypes.windll.user32.SetProcessDPIAware()
    
def bubble_sort(arr, draw_callback):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
            draw_callback(arr)
            yield arr

def selection_sort(arr, draw_callback):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
        draw_callback(arr)
        yield arr

def insertion_sort(arr, draw_callback):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i-1
        while j >= 0 and key < arr[j]:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
        draw_callback(arr)
        yield arr

class SortingVisualizer(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Sorting Visualizer")
        self.geometry("800x600")

        self.canvas = tk.Canvas(self, width=600, height=400, bg='white')
        self.canvas.pack(pady=20)
        
        self.algorithm = tk.StringVar(value='Bubble Sort')
        self.dropdown = ttk.Combobox(self, textvariable=self.algorithm, values=['Bubble Sort', 'Selection Sort', 'Insertion Sort'])
        self.dropdown.pack(pady=10)

        self.start_button = tk.Button(self, text="Start Sorting", command=self.start_sorting)
        self.start_button.pack(pady=10)
        
        self.anim = None
        self.sorting_func = {
            'Bubble Sort': bubble_sort,
            'Selection Sort': selection_sort,
            'Insertion Sort': insertion_sort
        }
        self.data = np.random.randint(1, 100, 50)
        self.plot_data()

    def plot_data(self):
        self.figure = plt.Figure(figsize=(6, 4), dpi=100)
        self.ax = self.figure.add_subplot(111)
        self.ax.bar(range(len(self.data)), self.data)
        self.ax.set_title('Sorting Visualizer')

        self.canvas_figure = FigureCanvasTkAgg(self.figure, master=self.canvas)
        self.canvas_figure.draw()
        self.canvas_figure.get_tk_widget().pack(fill=tk.BOTH, expand=True)

    def start_sorting(self):
        if self.anim:
            self.anim.event_source.stop()
        self.data = np.random.randint(1, 100, 50)
        self.plot_data()
        algo = self.algorithm.get()
        sorting_gen = self.sorting_func[algo](self.data.tolist(), self.update_plot)
        self.anim = animation.FuncAnimation(self.figure, self.update_plot, frames=sorting_gen, repeat=False)

    def update_plot(self, arr):
        self.ax.clear()
        self.ax.bar(range(len(arr)), arr)
        self.ax.set_title(self.algorithm.get() + " in Progress")
        self.canvas_figure.draw()

if __name__ == "__main__":
    app = SortingVisualizer()
    app.mainloop()
