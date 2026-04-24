export function parseDMS(dmsStr) {
  if (!dmsStr || typeof dmsStr !== 'string') return { lat: null, lng: null };

  const matches = [...dmsStr.matchAll(/(\d+\.?\d*)°\s*(\d+\.?\d*)'\s*(\d+\.?\d*)"?\s*([NSEWnsew])/g)];
  
  if (matches.length !== 2) {
    return { lat: null, lng: null };
  }

  const parsePart = (match) => {
    const deg = parseFloat(match[1]);
    const min = parseFloat(match[2]);
    const sec = parseFloat(match[3]);
    const dir = match[4].toUpperCase();

    let dd = deg + min / 60 + sec / 3600;
    if (dir === 'S' || dir === 'W') {
      dd = dd * -1;
    }
    return { dd, dir };
  };

  const part1 = parsePart(matches[0]);
  const part2 = parsePart(matches[1]);

  let lat = null;
  let lng = null;

  [part1, part2].forEach(part => {
    if (part.dir === 'N' || part.dir === 'S') lat = Number(part.dd.toFixed(6));
    if (part.dir === 'E' || part.dir === 'W') lng = Number(part.dd.toFixed(6));
  });

  return { lat, lng };
}
