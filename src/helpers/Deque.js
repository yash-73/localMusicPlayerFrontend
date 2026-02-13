class Deque {
  constructor(capacity) {
    if (!Number.isInteger(capacity) || capacity <= 0) {
      throw new Error("Capacity must be a positive integer");
    }

    this.capacity = capacity;
    this.buffer = new Array(capacity);
    this.head = 0;   // points to front element
    this.tail = 0;   // points to next insertion position at back
    this.length = 0;
  }

  size() {
    return this.length;
  }

  isEmpty() {
    return this.length === 0;
  }

  isFull() {
    return this.length === this.capacity;
  }

  enqueueBack(value) {
    if (this.isFull()) {
      // Evict front
      this.head = (this.head + 1) % this.capacity;
      this.length--;
    }

    this.buffer[this.tail] = value;
    this.tail = (this.tail + 1) % this.capacity;
    this.length++;
  }

  enqueueFront(value) {
    if (this.isFull()) {
      // Evict back
      this.tail = (this.tail - 1 + this.capacity) % this.capacity;
      this.length--;
    }

    this.head = (this.head - 1 + this.capacity) % this.capacity;
    this.buffer[this.head] = value;
    this.length++;
  }

  dequeueFront() {
    if (this.isEmpty()) return undefined;

    const value = this.buffer[this.head];
    this.head = (this.head + 1) % this.capacity;
    this.length--;
    return value;
  }

  dequeueBack() {
    if (this.isEmpty()) return undefined;

    this.tail = (this.tail - 1 + this.capacity) % this.capacity;
    const value = this.buffer[this.tail];
    this.length--;
    return value;
  }

  peekFront() {
    return this.isEmpty() ? undefined : this.buffer[this.head];
  }

  peekBack() {
    if (this.isEmpty()) return undefined;
    const index = (this.tail - 1 + this.capacity) % this.capacity;
    return this.buffer[index];
  }

  toArray() {
    const result = [];
    for (let i = 0; i < this.length; i++) {
      result.push(
        this.buffer[(this.head + i) % this.capacity]
      );
    }
    return result;
  }
}
