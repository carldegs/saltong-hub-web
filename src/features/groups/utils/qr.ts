// Layout constants
const CARD_W = 768;
const RADIUS = 28;
const TOP_PAD = 64;
const QR_CONTAINER_W = 600;
const QR_CONTAINER_H = 600;
const QR_INNER_PAD = 24; // white margin inside QR container
const BRAND_GREEN = "#2BD67B";
const CARD_BG = "#252827"; // matches site palette

// Text metrics
const LINE1_TEXT = "JOIN MY SaltongHub GROUP";
const LINE1_SIZE = 40;
const BASE_LINE2_SIZE = 64;
const TEXT_GAP = 20;
const BOTTOM_PAD = 64;

interface WrapLabelContext {
  ctx: CanvasRenderingContext2D;
  size: number;
  updateSize: (newSize: number) => void;
}

function wrapLabel(
  text: string,
  maxWidth: number,
  maxLines: number,
  context: WrapLabelContext
): string[] {
  const { ctx, size, updateSize } = context;
  const ellipsis = "…";
  const lines: string[] = [];
  const hasSpaces = /\s/.test(text);

  if (hasSpaces) {
    const words = text.split(/\s+/).filter(Boolean);
    let current = "";
    let currentSize = size;
    for (let i = 0; i < words.length; i++) {
      const tentative = current ? current + " " + words[i] : words[i];
      if (ctx.measureText(tentative).width <= maxWidth) {
        current = tentative;
      } else {
        if (current) {
          lines.push(current);
          current = words[i];
        } else {
          // single overly-long word among words: reduce font size until it fits
          while (
            ctx.measureText(words[i]).width > maxWidth &&
            currentSize > 28
          ) {
            currentSize -= 2;
            ctx.font = `800 ${currentSize}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`;
          }
          current = words[i];
        }
        if (lines.length === maxLines - 1) {
          break;
        }
      }
    }
    if (current) lines.push(current);

    // Ellipsize if we didn't consume all words
    const usedWords = lines.join(" ").split(/\s+/).filter(Boolean).length;
    if (usedWords < words.length) {
      let last = lines[lines.length - 1];
      while (
        ctx.measureText(last + ellipsis).width > maxWidth &&
        last.length > 0
      ) {
        last = last.slice(0, -1);
      }
      lines[lines.length - 1] = last + ellipsis;
    }
    if (lines.length > maxLines) lines.length = maxLines;
    updateSize(currentSize);
    return lines;
  }

  // No spaces: character-based wrapping
  let current = "";
  const currentSize = size;

  for (let i = 0; i < text.length; i++) {
    const tentative = current + text[i];
    if (ctx.measureText(tentative).width <= maxWidth) {
      current = tentative;
    } else {
      // push current line
      if (current) lines.push(current);
      current = text[i];
      if (lines.length === maxLines - 1) {
        // Build last line with ellipsis
        let last = current;
        for (let j = i + 1; j < text.length; j++) {
          const tryStr = last + text[j];
          if (ctx.measureText(tryStr + ellipsis).width <= maxWidth) {
            last = tryStr;
          } else {
            break;
          }
        }
        lines.push(last + ellipsis);
        updateSize(currentSize);
        return lines;
      }
    }
  }
  if (current) lines.push(current);
  if (lines.length > maxLines) {
    // truncate and ellipsize last
    let last = lines[maxLines - 1];
    while (
      ctx.measureText(last + ellipsis).width > maxWidth &&
      last.length > 0
    ) {
      last = last.slice(0, -1);
    }
    lines.length = maxLines;
    lines[maxLines - 1] = last + ellipsis;
  }
  updateSize(currentSize);
  return lines;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

interface QrCardParams {
  img: HTMLImageElement;
  groupText: string;
  canvas: HTMLCanvasElement;
}

function drawQrCard({ img, groupText, canvas }: QrCardParams): {
  canvas: HTMLCanvasElement;
  finalSize: number;
} {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { canvas, finalSize: BASE_LINE2_SIZE };
  }

  const maxTextWidth = CARD_W - 120;
  let size = BASE_LINE2_SIZE;
  ctx.font = `800 ${size}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`;

  const lines = wrapLabel(groupText, maxTextWidth, 3, {
    ctx,
    size,
    updateSize: (newSize) => {
      size = newSize;
    },
  });

  const lineHeight = size;
  const interLine = 10;
  const textBlockH =
    LINE1_SIZE +
    TEXT_GAP +
    lines.length * lineHeight +
    (lines.length - 1) * interLine;
  const CARD_H = TOP_PAD + QR_CONTAINER_H + 48 + textBlockH + BOTTOM_PAD;
  canvas.height = CARD_H * 2;
  ctx.setTransform(2, 0, 0, 2, 0, 0);

  // Transparent background with dark rounded card
  roundRect(ctx, 0, 0, CARD_W, CARD_H, RADIUS);
  ctx.fillStyle = CARD_BG;
  ctx.fill();

  // White QR container
  const qrX = (CARD_W - QR_CONTAINER_W) / 2;
  const qrY = TOP_PAD;
  roundRect(ctx, qrX, qrY, QR_CONTAINER_W, QR_CONTAINER_H, 24);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  // Draw QR within container with inner padding
  const qrImgX = qrX + QR_INNER_PAD;
  const qrImgY = qrY + QR_INNER_PAD;
  const qrImgSize = QR_CONTAINER_W - QR_INNER_PAD * 2;
  ctx.drawImage(img, qrImgX, qrImgY, qrImgSize, qrImgSize);

  // Text rendering
  const textCenterX = CARD_W / 2;
  ctx.fillStyle = BRAND_GREEN;
  ctx.font = `700 ${LINE1_SIZE}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const line1Y = qrY + QR_CONTAINER_H + 48;
  ctx.fillText(LINE1_TEXT, textCenterX, line1Y);

  ctx.font = `800 ${size}px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif`;
  let y = line1Y + LINE1_SIZE + TEXT_GAP;
  for (const ln of lines) {
    ctx.fillText(ln, textCenterX, y);
    y += lineHeight + interLine;
  }

  return { canvas, finalSize: size };
}

export function downloadStyledQrPng(svg: SVGSVGElement, label?: string) {
  const serialized = new XMLSerializer().serializeToString(svg);
  const qrDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serialized)}`;

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const scale = 2; // retina export
    canvas.width = CARD_W * scale;
    canvas.height = (TOP_PAD + QR_CONTAINER_H + 300) * scale; // temp height for measurement

    drawQrCard({ img, groupText: label ?? "", canvas });

    // Export
    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "saltong-group-qr.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  img.src = qrDataUrl;
}

export async function shareQrImage(svg: SVGSVGElement, label?: string) {
  const serialized = new XMLSerializer().serializeToString(svg);
  const qrDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serialized)}`;

  return new Promise<void>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = 2;
      canvas.width = CARD_W * scale;
      canvas.height = (TOP_PAD + QR_CONTAINER_H + 300) * scale;

      drawQrCard({ img, groupText: label ?? "", canvas });

      canvas.toBlob((blob) => {
        if (!blob) {
          resolve();
          return;
        }
        const file = new File([blob], "saltong-group-qr.png", {
          type: "image/png",
        });
        navigator
          .share({
            files: [file],
            title: "Saltong Hub Group QR Code",
            text: "Join my Saltong Hub group!",
          })
          .catch(() => {
            // User cancelled share or share failed - resolve silently
          })
          .finally(() => resolve());
      }, "image/png");
    };
    img.src = qrDataUrl;
  });
}
