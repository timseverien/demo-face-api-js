export default function getBoxFromPoints(points) {
  const box = {
    bottom: -Infinity,
    left: Infinity,
    right: -Infinity,
    top: Infinity,

    get center() {
      return {
        x: this.left + this.width / 2,
        y: this.top + this.height / 2,
      };
    },

    get height() {
      return this.bottom - this.top;
    },

    get width() {
      return this.right - this.left;
    },
  };

  for (const point of points) {
    box.left = Math.min(box.left, point.x);
    box.right = Math.max(box.right, point.x);

    box.bottom = Math.max(box.bottom, point.y);
    box.top = Math.min(box.top, point.y);
  }

  return box;
}
