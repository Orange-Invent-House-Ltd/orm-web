/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        fontFamily: {
            satoshi: ["Satoshi", "san-serif"],
        },
        extend: {
            colors: {
                primary: {
                    light: " #FECA9F",
                    normal: "#FD7E14",
                    dark: " #9A4D0C",
                },
                secondary: "#4F4F4F",
                status: {
                    fulfilled: "#047857",
                    resolved: "#047857",
                    successful: "#0D9488",
                    inprogress: "#1D4ED8",
                    pending: "#B45309",
                    rejected: "#B91C1C",
                    canceled: "#374151",
                },
                statusbg: {
                    fulfilled: "#DCFCE7",
                    resolved: "#DCFCE7",
                    successful: "#CFFAFE",
                    inprogress: "#DBEAFE",
                    pending: "#FEF3CF",
                    rejected: "#FEE2E2",
                    canceled: "#F3F4F6",
                },
                gray: "#6D6D6D",
                "black-rgba": "rgba(58, 58, 58, 0.6)",
                greyBg: "rgba(237, 237, 237, 0.16)",
                headingColor: "#121212",
                tertiary: "#B1580E",
            },
            backgroundImage: {
                benefit: "url('/src/assets/images/bg-pix.png')",
            },
            boxShadow: {
                "3xl":
                    "0px 9.40171px 9.40171px -4.70085px rgba(0, 0, 0, 0.04), 0px 18.8034px 23.5043px -4.70085px rgba(0, 0, 0, 0.1)",
            },
        },
    },
    plugins: [require("tailwindcss-animated")],
};
