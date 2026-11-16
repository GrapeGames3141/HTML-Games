"""Extract the documented 24km Mt Mitchell crop from local zoom-12 Terrarium tiles."""
from pathlib import Path
from PIL import Image
import struct, base64
root=Path(__file__).parent/'dem12'; out=Path(__file__).parent
m=Image.new('RGB',(1024,1024))
for x in range(1110,1114):
 for y in range(1610,1614):m.paste(Image.open(root/f'terrain-12-{x}-{y}.png').convert('RGB'),((x-1110)*256,(y-1610)*256))
cx,cy,span,n=513.5291733333,446.7202272385,773.9084045,513
a=[]
for j in range(n):
 y=round(cy-span/2+j*span/(n-1))
 for i in range(n):
  x=round(cx-span/2+i*span/(n-1));r,g,b=m.getpixel((x,y));a.append(round(r*256+g+b/256-32768))
raw=struct.pack('<'+'H'*len(a),*a)
(out/'mt-mitchell-dem-513.b64.txt').write_text(base64.b64encode(raw).decode())
# Lossless row-wise deltas: first cell of each 513-wide row stays absolute;
# later cells are signed int16 height deltas. The browser inflates and restores
# this stream before building the terrain mesh.
d=[]
for row in range(n):
    start=row*n
    d.append(a[start])
    d.extend(a[start+i]-a[start+i-1] for i in range(1,n))
packed=struct.pack('<'+'h'*len(d),*(v if v<32768 else v-65536 for v in d))
import zlib
encoded=base64.b64encode(zlib.compress(packed,9)).decode()
(out/'mt-mitchell-dem-513-rowdelta-deflate.b64.txt').write_text(encoded)
# Independent lossless round-trip assertion for the retained artifact.
back=struct.unpack('<'+'h'*len(d),zlib.decompress(base64.b64decode(encoded)))
check=[]
for row in range(n):
    value=back[row*n] & 65535;check.append(value)
    for i in range(1,n): value+=back[row*n+i];check.append(value)
assert check==a
# Shipping representation: 65×65 samples across the same 24 km crop, each
# elevation quantized to two metres, then row-delta DEFLATE. It retains the
# measured broad contours while procedural detail supplies smaller-scale form.
coarse=[]
for row in range(65):
    for col in range(65): coarse.append(round(a[(row*8)*n+col*8]/2))
cd=[]
for row in range(65):
    base=row*65;cd.append(coarse[base]);cd.extend(coarse[base+i]-coarse[base+i-1] for i in range(1,65))
compact=base64.b64encode(zlib.compress(struct.pack('<'+'h'*len(cd),*cd),9)).decode()
(out/'mt-mitchell-dem-65-2m-rowdelta-deflate.b64.txt').write_text(compact)
assert all(abs(coarse[r*65+c]*2-a[(r*8)*n+c*8])<=1 for r in range(65) for c in range(65))
print(min(a),max(a),len(a),len(encoded),len(compact))
