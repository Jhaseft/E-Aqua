import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';
import animations from '@midudev/tailwind-animations';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                playfair: ['Playfair Display', 'serif'],
                poppins: ['Poppins', 'sans-serif'],
            },

            colors: {
                bluePrimary: '#0784c5',   // Azul principal
                greenDark: '#176c36',     // Verde oscuro
                blueLight: '#add8df',     // Azul claro
                blueSecondary: '#5398bb', // Azul secundario
                aquamarine: '#2DD4BF',    // Verde aquamarine (Armo Química)
            },
        },
    },

    plugins: [
        forms,
        animations,
    ],
};
