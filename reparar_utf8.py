from pathlib import Path
from ftfy import fix_text

CARPETA = Path("src")

EXTENSIONES = {
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".css",
}

archivos_modificados = 0

for archivo in CARPETA.rglob("*"):

    if not archivo.is_file():
        continue

    if archivo.suffix.lower() not in EXTENSIONES:
        continue

    try:
        texto_original = archivo.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        print(f"No se pudo leer como UTF-8: {archivo}")
        continue

    texto_corregido = fix_text(texto_original)

    if texto_corregido != texto_original:
        archivo.write_text(
            texto_corregido,
            encoding="utf-8",
            newline="\n"
        )

        archivos_modificados += 1
        print(f"CORREGIDO: {archivo}")

print()
print(f"Archivos modificados: {archivos_modificados}")