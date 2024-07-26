const arrayContainer = document.getElementById('array-container');
const startSortButton = document.getElementById('start-sort');
const algorithmSelect = document.getElementById('algorithm-select');
const speedControl = document.getElementById('speed-control');

let array = Array.from({ length: 30 }, () => Math.floor(Math.random() * 300) + 10);
let delay = parseInt(speedControl.value);

function createBars(array) {
    arrayContainer.innerHTML = '';
    array.forEach(value => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${value}px`;
        arrayContainer.appendChild(bar);
    });
}

function delayExecution(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort() {
    const bars = document.querySelectorAll('.bar');
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - 1 - i; j++) {
            bars[j].classList.add('highlight');
            bars[j + 1].classList.add('highlight');
            if (array[j] > array[j + 1]) {
                await swap(bars[j], bars[j + 1], array, j, j + 1);
            }
            bars[j].classList.remove('highlight');
            bars[j + 1].classList.remove('highlight');
        }
        bars[array.length - 1 - i].classList.add('sorted');
    }
}

async function selectionSort() {
    const bars = document.querySelectorAll('.bar');
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        bars[i].classList.add('highlight');
        for (let j = i + 1; j < array.length; j++) {
            bars[j].classList.add('highlight');
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
            await delayExecution(delay);
            bars[j].classList.remove('highlight');
        }
        await swap(bars[i], bars[minIndex], array, i, minIndex);
        bars[i].classList.remove('highlight');
        bars[i].classList.add('sorted');
    }
    bars[array.length - 1].classList.add('sorted');
}

async function insertionSort() {
    const bars = document.querySelectorAll('.bar');
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        bars[i].classList.add('highlight');
        while (j >= 0 && array[j] > key) {
            bars[j].classList.add('highlight');
            array[j + 1] = array[j];
            bars[j].style.height = `${array[j]}px`;
            j--;
            await delayExecution(delay);
            bars[j + 1].classList.remove('highlight');
        }
        array[j + 1] = key;
        bars[j + 1].style.height = `${key}px`;
        bars[j + 1].classList.remove('highlight');
        bars[j + 1].classList.add('sorted');
    }
    bars[array.length - 1].classList.add('sorted');
}

async function mergeSort(array) {
    const bars = document.querySelectorAll('.bar');
    const merge = async (left, right, start, end) => {
        let i = 0, j = 0, k = start;
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                array[k++] = left[i++];
            } else {
                array[k++] = right[j++];
            }
        }
        while (i < left.length) {
            array[k++] = left[i++];
        }
        while (j < right.length) {
            array[k++] = right[j++];
        }
        updateBars(start, end);
    };

    const mergeSortRecursive = async (start, end) => {
        if (start >= end) return;
        const mid = Math.floor((start + end) / 2);
        await mergeSortRecursive(start, mid);
        await mergeSortRecursive(mid + 1, end);
        await merge(array.slice(start, mid + 1), array.slice(mid + 1, end + 1), start, end);
    };

    await mergeSortRecursive(0, array.length - 1);
    updateBars(0, array.length - 1);
}

function quickSort() {
    const bars = document.querySelectorAll('.bar');
    const quickSortRecursive = async (low, high) => {
        if (low < high) {
            const pi = await partition(low, high);
            await quickSortRecursive(low, pi - 1);
            await quickSortRecursive(pi + 1, high);
        }
    };

    const partition = async (low, high) => {
        const pivot = array[high];
        const bars = document.querySelectorAll('.bar');
        let i = low - 1;
        for (let j = low; j < high; j++) {
            bars[j].classList.add('highlight');
            if (array[j] < pivot) {
                i++;
                await swap(bars[i], bars[j], array, i, j);
            }
            bars[j].classList.remove('highlight');
        }
        await swap(bars[i + 1], bars[high], array, i + 1, high);
        return i + 1;
    };

    quickSortRecursive(0, array.length - 1);
}

async function swap(bar1, bar2, array, index1, index2) {
    return new Promise(resolve => {
        setTimeout(() => {
            const temp = array[index1];
            array[index1] = array[index2];
            array[index2] = temp;

            const height1 = bar1.style.height;
            const height2 = bar2.style.height;

            bar1.style.height = height2;
            bar2.style.height = height1;

            resolve();
        }, delay);
    });
}

function updateBars(start, end) {
    const bars = document.querySelectorAll('.bar');
    for (let i = start; i <= end; i++) {
        bars[i].style.height = `${array[i]}px`;
        bars[i].classList.add('sorted');
    }
}

async function startSorting() {
    const algorithm = algorithmSelect.value;
    delay = parseInt(speedControl.value);
    array = Array.from({ length: 30 }, () => Math.floor(Math.random() * 300) + 10);
    createBars(array);

    switch (algorithm) {
        case 'bubble':
            await bubbleSort();
            break;
        case 'selection':
            await selectionSort();
            break;
        case 'insertion':
            await insertionSort();
            break;
        case 'merge':
            await mergeSort(array);
            break;
        case 'quick':
            await quickSort();
            break;
    }
}

startSortButton.addEventListener('click', startSorting);
speedControl.addEventListener('input', () => {
    delay = parseInt(speedControl.value);
});

createBars(array); // Initial creation of bars
