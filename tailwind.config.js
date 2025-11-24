/** @type {import('tailwindcss').Config} */
module.exports = {
    // Contenido de los archivos que deben ser escaneados por NativeWind/Tailwind
    content: [
        "./App.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        // VITAL: Debes incluir el preset de NativeWind aquí
        require("nativewind/tailwind/preset"),
    ],
    // Importante: La propiedad 'presets' DEBE incluir el preset de NativeWind
    presets: [require("nativewind/tailwind/preset")],
}