module.exports = {
  // Usa el preset oficial de React Native
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // El plugin de NativeWind debe ir aquí
    "nativewind/babel",

    // Este plugin es necesario para que React Native Reanimated funcione correctamente
    // Debe ser el último plugin en la lista.
    'react-native-reanimated/plugin',
  ],
};