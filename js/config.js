const state = {
  stream: null,
  shots: [],
  filter: 'none',
  layout: '2x2',
  frame: 'none',
  showDate: true,
  showCaption: false,
  timer: 0,
  isCounting: false
};

const FILTERS = [
  { id: 'none',    label: 'Original', css: 'none' },
  { id: 'vivid',   label: 'Vivid',    css: 'saturate(1.8) contrast(1.1)' },
  { id: 'bw',      label: 'B&W',      css: 'grayscale(1)' },
  { id: 'vintage', label: 'Vintage',  css: 'sepia(0.6) contrast(0.9) brightness(1.1)' },
  { id: 'cool',    label: 'Cool',     css: 'hue-rotate(180deg) saturate(0.8) brightness(1.05)' },
  { id: 'warm',    label: 'Warm',     css: 'sepia(0.3) saturate(1.4) brightness(1.05)' },
  { id: 'fade',    label: 'Fade',     css: 'contrast(0.8) brightness(1.1) saturate(0.9)' },
  { id: 'drama',   label: 'Drama',    css: 'contrast(1.4) saturate(0.7) brightness(0.95)' }
];

const LAYOUTS = [
  { id: '2x2', label: '2×2', cols: 2, rows: 2 },
  { id: '4x1', label: '4×1', cols: 1, rows: 4 },
  { id: '1x4', label: '1×4', cols: 4, rows: 1 },
  { id: '3x1', label: '3×1', cols: 1, rows: 3 },
  { id: '2x3', label: '2×3', cols: 2, rows: 3 },
  { id: '1x1', label: '1×1', cols: 1, rows: 1 }
];
