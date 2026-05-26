export function LearnifyLogoSVG({ width = 200, height = 120 }: { width?: number; height?: number }) {
  return (
    <img
      src="/learnify-logo.png"
      width={width}
      height={height}
      style={{ objectFit: 'contain', display: 'block' }}
      alt="Learnify Academy"
      crossOrigin="anonymous"
    />
  )
}

export function learnifyLogoHTMLString(width = 200, height = 120, origin = ''): string {
  return `<img src="${origin}/learnify-logo.png" width="${width}" height="${height}" style="object-fit:contain;display:block" alt="Learnify Academy" />`
}
