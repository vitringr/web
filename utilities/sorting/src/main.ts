export function bubbleSort(arr: number[]): void {
  const end = arr.length - 1;
  for (let i = 0; i < end; i++) {
    let swapped = false;
    for (let k = 0; k < end - i; k++) {
      if (arr[k] > arr[k + 1]) {
        const temp = arr[k];
        arr[k] = arr[k + 1];
        arr[k + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) break;
  }
}

export function selectionSort(arr: number[]): void {
  for (let i = 0; i < arr.length - 1; i++) {
    let min = i;
    for (let k = i + 1; k < arr.length; k++) {
      if (arr[k] < arr[min]) min = k;
    }
    if (min !== i) {
      const tmp = arr[i];
      arr[i] = arr[min];
      arr[min] = tmp;
    }
  }
}

export function insertionSort(arr: number[]): void {
  for (let i = 1; i < arr.length; i++) {
    const current = arr[i];
    let k = i - 1;

    while (k >= 0 && arr[k] > current) {
      arr[k + 1] = arr[k];
      k--;
    }

    arr[k + 1] = current;
  }
}
