import React, { useState } from "react";
import AppLayout from "../components/AppLayout";
import LaunchCalendar from "../components/LaunchCalendar/LaunchCalendar";
import { FilterItem } from "../components/FilterItem";
import html2pdf from 'html2pdf.js';
import { MdOutlineDownload } from "react-icons/md";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
const fileExtension = ".xlsx";
const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

const MarketingCalendar = () => {
  const [brand, setBrand] = useState(null);
  const [productList,setProductList] = useState([
    {
      month: "Jan",
      content: [
        {
          brand: "AERIN",
          date: "01/JAN/2024",
          OCDDate: "01/MAR/2024",
          image: "/assets/images/25.png",
          name: "Mediterranean Honeysuckle Essentials Set",
          size: "30 ml",
          description:
            "This travel-friendly set features AERIN's bestselling Mediterranean Honeysuckle scent that includes: 1.7 fl oz / 50 mL Mediterranean Honeysuckle Eau De Parfum, .24 fl oz / 7 mL Travel Size Mediterranean Honeysuckle Eau De Parfum, .17 fl oz / 4 mL Mini Mediterranean Honeysuckle Eau De Parfum, .14 fl oz / 4 mL Mini Fleur De Peony Eau De Parfum, and a Cosmetic Bag.",
          brandLogo: "/assets/images/Aren-logo.png",
        },
        {
          brand: "Re-Nutriv",
          date:  "26/FEB/2024",
          OCDDate: 
           "26/FEB/2024",
          image: "/assets/images/27.png",
          name: "Re Nutriv Ultimate Diamond Brilliance Crème REFILL ",
          size: "50 ml",
          description: "The transcendently weightless, delightfully indulgent fluid absorbs quickly to refresh skin and help restore a plumper, smoother feel.",
          brandLogo: "/assets/images/renutrive-logo.png",
        },
        {
          brand: "RMS Beauty",
          date: "29/JAN/2024",
          OCDDate: "ASAP",
          image: "/assets/images/02.png",
          name: "LipNight",
          size: "09 g",
          description: "Naturally fragranced and flavored with Vanilla and soothing Chamomile Oil, this overnight treatment sweetly blankets and soothes lips while you slumber.",
          brandLogo: "/assets/images/rms-beauty.png",
        },
        {
          brand: "RMS Beauty",
          date: "29/JAN/2024",
          OCDDate: "ASAP",
          image: "/assets/images/03.png",
          name: "Skin2Skin Everything Brush",
          size: "N/A",
          description:
            "Expertly designed using luxuriously soft imitation goat hair, our Skin2SKin Everything Brush helps to deposit just the right amount of product to the face, while its flexible bristles make it easy to control and blend for a natural look.",
          brandLogo: "/assets/images/rms-beauty.png",
        },
        {
          brand: "RMS Beauty",
          date: "29/JAN/2024",
          OCDDate: "28/FEB/2024",
          image: "/assets/images/04.png",
          name: "Kakadu Luxe Cream",
          size: "50 ML",
          description: "A luscious creamy mousse enriched with a high concentration of antioxidants and Vitamin A, C & E to help nourish and revitalise your skin.",
          brandLogo: "/assets/images/rms-beauty.png",
        },

        {
          brand: "Bobbi Brown",
          date: "01/Dec/2023",
          OCDDate: "01/JAN/2024",
          image: "/assets/images/Smoothing1.png",
          name: "Vitamin Enriched Smoothing Serum",
          size: "30 ml",
          description: "When used with Vitamin Enriched Face Base, it helps plump skin and smooth makeup application.",
          brandLogo: "/assets/images/BobbyBrown.png",
        },
        {
          brand: "Bobbi Brown",
          date: "01/Dec/2023",
          OCDDate: "01/JAN/2024",
          image: "/assets/images/Smoothing2.png",
          name: "Soothing Cleansing Oil Relaunch ",
          size: "200 ml",
          description: "Soothing Cleansing Oil makeup remover removes makeup, dirt and all impurities from your face perfectly and leaves the skin soft and clean.",
          brandLogo: "/assets/images/BobbyBrown.png",
        },
        {
          brand: "Byredo",
          date: "TBD/Dec/2023",
          OCDDate: "25/JAN/2024",
          image: "/assets/images/Smoothing16.png",
          name: "Liquid Lipstick Matte",
          size: "N/A",
          description: "Available in ten glossy shades of high-pigmentation neutrals.",
          brandLogo: "/assets/images/Byredo.png",
        },

        {
          brand: "Diptyque",
          date: "TBD",
          OCDDate: "02/JAN/2024",
          image: "/assets/images/Smoothing21.png",
          name: "Fleur de Peau Hair Mist",
          size: "30 ml",
          description: "Hair mist leaves an intensely scented veil of fragrance on the hair.",
          brandLogo: "/assets/images/Diptuque.png",
        },

        {
          brand: "Diptyque",
          date: "TBD",
          OCDDate: "02/JAN/2024",
          image: "/assets/images/Smoothing21.png",
          name: "Fleur de Peau Hand and Body Gel",
          size: "200 ml",
          description: "A new addition to the Fleur de Peau fragrance family, this Hand and Body Cleansing Gel pays tribute to the sensual notes of musk.",
          brandLogo: "/assets/images/Diptuque.png",
        },

        {
          brand: "Diptyque",
          date: "TBD",
          OCDDate: "16/JAN/2024",
          image: "/assets/images/Smoothing2s1.png",
          name: "Valentine’s Duo",
          size: "190 g",
          description: "A delicate, scented declaration of love incorporating elements of tenderness and passion, flowers and leaves.",
          brandLogo: "/assets/images/Diptuque.png",
        },

        {
          brand: "Diptyque",
          date: "TBD",
          OCDDate: "02/JAN/2024",
          image: "/assets/images/Smoothing21.png",
          name: "Fleur de Peau Hand and body lotion",
          size: "200 ml",
          description: "An intensely perfumed veil, distilling all the carnal sweetness of the musk in Fleur de Peau into an ode to the legendary love of Eros and Psyche. ",
          brandLogo: "/assets/images/Diptuque.png",
        }, {
          brand: "Diptyque",
          date: "22/Jan/2023",
          OCDDate: "15/Feb/2024",
          image: "/assets/images/Smoothing22.png",
          name: "Tuberose Candle",
          size: "190g",
          description: "This candle of scented wax conveys every facet of the tuberose.",
          brandLogo: "/assets/images/Diptuque.png",
        },
        {
          brand: "Diptyque",
          date: "22/Jan/2023",
          OCDDate: "15/Feb/2024",
          image: "/assets/images/Smoothing22.png",
          name: "Tuberose Candle",
          size: "300g",
          description: "This candle of scented wax conveys every facet of the tuberose.",
          brandLogo: "/assets/images/Diptuque.png",
        },
        {
          brand: "Diptyque",
          date: "22/Jan/2023",
          OCDDate: "15/Feb/2024",
          image: "/assets/images/Smoothing22.png",
          name: "Do Son EDP",
          size: "75 ml",
          description: "A tuberose whose scent brings to mind the twilight hour, when the white flowers stand out in the darkness.",
          brandLogo: "/assets/images/Diptuque.png",
        },
        {
          brand: "Diptyque",
          date: "22/Jan/2023",
          OCDDate: "15/Feb/2024",
          image: "/assets/images/Smoothing22.png",
          name: "Do Son EDP",
          size: "100 ml",
          description: "A tuberose whose scent brings to mind the twilight hour, when the white flowers stand out in the darkness.",
          brandLogo: "/assets/images/Diptuque.png",
        },
        // Add more products for January
      ],
    },
    {
      month: "Feb",
      content: [
        {
          brand: "RMS Beauty",
          date: "TBD",
          OCDDate: "01/FEB/2024",
          image: "/assets/images/11.png",
          name: "SuperNatural SPF International Formula",
          size: "30 ml",
          description:
            "This variation of the formula is not for sale in the U.S. or Canada. A tinted skin nourishing, mineral-based daily sunscreen serum and soft focus complexion corrector with natural-looking illumination and SPF 30 broad spectrum protection.",
          brandLogo: "/assets/images/rms-beauty.png",
        },
        {
          brand: "RMS Beauty",
          date: "26/FEB/2024",
          OCDDate: "26/MAR/2024",
          image: "/assets/images/05.png",
          name: "Re Dimension Hydra",
          size: "30 ml",
          description: "It glides on effortlessly, infusing skin with multi-dimensional life as the bouncy, light-as-air gel blends and builds color.",
          brandLogo: "/assets/images/rms-beauty.png",
        },

        {
          brand: "Bumble and Bumble",
          date: "15/Jan/2023",
          OCDDate: "01/JAN/2024",
          image: "/assets/images/Smoothing6.png",
          name: "DrySpun LIGHT",
          size: "9.35 oz",
          description: "This new, updated formula provides lightweight moisture – and contains Emblica technology, which expands each strand for voluminous, full-bodied styles.",

          brandLogo: "/assets/images/bumbleAndBumble.png",
        },

       
        // Add more products for February
      ],
    },
    {
      month: "Mar",
      content: [
        {
          brand: "Smashbox",
          date: "01/MAR/2024",
          OCDDate: "04/APR/2024",
          image: "/assets/images/07.png",
          name: "Sculpt & Glow Face Palette",
          size: "N/A",
          description: "Our versatile powders can be used to shape, highlight, and add a flush of color in a variety of ways.",
          brandLogo: "/assets/images/smashbox_logo.png",
        },
        {
          brand: "Diptyque",
          date: "TBD/Mar/2024",
          OCDDate: "TBD/Apr/2024",
          image: "/assets/images/Smoothing23.png",
          name: "Coffee Candle",
          size: "190g",
          description: "A cup realised and assembled manually by ceramicist Toma Blok in his workshop in the Paris region, and available in a strictly limited edition.",
          brandLogo: "/assets/images/Diptuque.png",
        },
        {
          brand: "Diptyque",
          date: "TBD/Mar/2024",
          OCDDate: "TBD/Apr/2024",
          image: "/assets/images/Smoothing23.png",
          name: "Cookie Candle",
          size: "190g",
          description: "A cup realised and assembled manually by ceramicist Toma Blok in his workshop in the Paris region, and available in a strictly limited edition.",
          brandLogo: "/assets/images/Diptuque.png",
        },
        {
          brand: "Diptyque",
          date: "TBD/Mar/2024",
          OCDDate: "TBD/Apr/2024",
          image: "/assets/images/Smoothing23.png",
          name: "Whipped Cream Candle",
          size: "190g",
          description: "Enriched with aloe vera and macadamia oil, this unique Crème de Parfum format repairs and protects your hands while perfuming them with our iconic fragrances.",
          brandLogo: "/assets/images/Diptuque.png",
        },
        {
          brand: "Diptyque",
          date: "TBD/Mar/2024",
          OCDDate: "TBD/Apr/2024",
          image: "/assets/images/Smoothing23.png",
          name: "Mini Candle Boxed Set",
          size: "3*70g",
          description: "Whether you go for a ready-made or create-your-own option, these gift sets and boxes are great for showcasing the finest selection of scents",
          brandLogo: "/assets/images/Diptuque.png",
        },
        {
          brand: "Kevyn Aucoin Cosmetics",
          date: "01/MAR/2024",
          OCDDate: "04/APR/2024",
          image: "/assets/images/10.png",
          name: "Face Forward Color Correcting Wheel",
          size: "N/A",
          description: "Color correcting is a concealer technique that professional makeup artists have used for years and that went mainstream after social media got wind of the trend.",

          brandLogo: "/assets/images/kevy_logo.png",
        },
        {
          brand: "Re-Nutriv",
          date: "04/MAR/2024",
          OCDDate: "15/APR/2024",
          image: "/assets/images/28.png",
          name: "Re Nutriv Rich Foam Cleanser ",
          size: "4.2 oz",
          description: "The exceptionally rich formula of the Re-Nutriv Intensive Hydrating Foam Cleanser thoroughly but gently removes impurities and makeup.",
          brandLogo: "/assets/images/renutrive-logo.png",
        },

        {
          brand: "Bumble and Bumble",
          date: "15/Feb/2024",
          OCDDate: "01/Mar/2024",
          image: "/assets/images/Smoothing10.png",
          name: "HIO Trial Kit",
          size: "N/A",
          description:
            "The Hairdresser’s Invisible Oil Trial Kit contains  HIO Shampoo, HIO Conditioner, HIO Primer, etc. A mini set with travel size bottles of Hairdresser’s Invisible Oil Shampoo, Hairdresser’s Invisible Oil Conditioner, and Hairdresser’s Invisible Oil Protective Primer to transform dry, coarse or brittle hair – leaving it soft, silky, and smooth.",

          brandLogo: "/assets/images/bumbleAndBumble.png",
        },

        {
          brand: "Bumble and Bumble",
          date: "15/Feb/2024",
          OCDDate: "01/Mar/2024",
          image: "/assets/images/Smoothing8.png",
          name: "Bond Trial Kit",
          size: "N/A",
          description: "Bond Treatment Trial Kit is a four-part system of professional and high quality products created to protect hair from damage and the perfect.",
          brandLogo: "/assets/images/bumbleAndBumble.png",
        },

        {
          brand: "Bumble and Bumble",
          date: "15/Feb/2024",
          OCDDate: "01/Mar/2024",
          image: "/assets/images/Smoothing9.png",
          name: "Bb. Curl Trial Kit ",
          size: "N/A",
          description:
            "This moisturizing, curl-loving gentle cleanser is now enhanced with a rich blend of oils (Avocado, Coconut, Jojoba) and butters (Shea, Cocoa) – to leave hair shiny, deeply hydrate, and reduce frizz.",
          brandLogo: "/assets/images/bumbleAndBumble.png",
        },

        {
          brand: "Bumble and Bumble",
          date: "15/Feb/2024",
          OCDDate: "01/Mar/2024",
          image: "/assets/images/Smoothing7.png",
          name: "Thickening Trial Kit",
          size: "N/A",
          description: "This lightweight in-shower treatment, powered by Emblica Technology, plumps strands from roots to ends for a thicker, fuller, volumized look.",
          brandLogo: "/assets/images/bumbleAndBumble.png",
        },

        {
          brand: "ReVive",
          date: "20/Mar/2024",
          OCDDate: "ASAP",
          image: "/assets/images/Smoothing25.png",
          name: "Brightening Serum ",
          size: "30 ml",
          description:
            "Powered by a potent combination of pure Vitamin C and moisture-rich serum, this daily treatment leaves skin radiant, while helping to reduce discoloration, fine lines and wrinkles.",
          brandLogo: "/assets/images/revive.png",
        },
      ],
    },
    {
      month: "APR",
      content: [
        {
          brand: "Kevyn Aucoin Cosmetics",
          date: "01/APR/2024",
          OCDDate: "30/MAY/2024",
          image: "/assets/images/12.png",
          name: "Single-Ended Brushes",
          size: "N/A",
          description: "The secret to beautiful, natural-looking makeup is the right tools, including these makeup brushes from Kevyn Aucoin Beauty.",

          brandLogo: "/assets/images/kevy_logo.png",
        },
        {
          brand: "Kevyn Aucoin Cosmetics",
          date: "01/APR/2024",
          OCDDate: "30/MAY/2024",
          image: "/assets/images/11.png",
          name: "Micro Sculpting Brow",
          size: "N/A",
          description: "The Color Stick is a pigment-rich, ultra-creamy, & lightweight blush that offers buildable color, a skin-softening finish, and long-lasting wear.",
          brandLogo: "/assets/images/kevy_logo.png",
        },
        {
          brand: "BY TERRY",
          date: "01/APR/2024",
          OCDDate: "30/MAY/2024",
          image: "/assets/images/08.png",
          name: "Crayon Blackstar Shade Extension",
          size: "N/A",
          description: "Waterproof and longlasting eye pencil enriched with youth ingredients. Highly pigmented color. No transfer, no smudging.",
          brandLogo: "/assets/images/Byterry_logo.png",
        },

        {
          brand: "Maison Margiela",
          date: "01/APR/2024",
          OCDDate: "01/MAY/2024",
          image: "/assets/images/18.png",
          name: "From the Garden EDT",
          size: "30 ml",
          description: "A citrusy and earthy perfume that transports you to the joyful memory of a sunny afternoon spent in the garden.",
          brandLogo: "/assets/images/maisonMargilia_logo.png",
        },
        {
          brand: "Maison Margiela",
          date: "01/APR/2024",
          OCDDate: "01/MAY/2024",

          image: "/assets/images/19.png",
          name: "From the Garden Candle",
          size: "165 g",
          description: "A collection of high-end scented candles from Maison Margiela, inviting you to relive forgotten memories and emotions at home.",
          brandLogo: "/assets/images/maisonMargilia_logo.png",
        },

        {
          brand: "Bobbi Brown",
          date: "01/Mar/2024",
          OCDDate: "01/Apr/2024",

          image: "/assets/images/Smoothing3.png",
          name: "Long Wear Cream Liner Sticks",
          size: "N/A",
          description: "Long-Wear Cream Shadow Stick glides on lids and stays color true for endless eye looks.",
          brandLogo: "/assets/images/BobbyBrown.png",
        },
        {
          brand: "Bobbi Brown",
          date: "01/Mar/2024",
          OCDDate: "01/Apr/2024",
          image: "/assets/images/Smoothing4.png",
          name: "Long Wear Cream Shadow Sticks Shade Extension",
          size: "30 ml",
          description: "It glides on effortlessly, infusing skin with multi-dimensional life as the bouncy, light-as-air gel blends and builds color.",
          brandLogo: "/assets/images/BobbyBrown.png",
        },

        {
          brand: "Byredo",
          date: "TBD/Mar/2024",
          OCDDate: "04/Apr/2024",
          image: "/assets/images/Smoothing17.png",
          name: "Mineralescape Eyeshadow",
          size: "N/A",
          description: "eyeshadows include highly buildable shades providing everything from neutral, natural-looking washes of colour to vividly pigmented eye looks.",
          brandLogo: "/assets/images/Byredo.png",
        },
        
        // Add more products for February
      ],
    },
    {
      month: "MAY",
      content: [
        {
          brand: "BY TERRY",
          date: "01/MAY/2024",
          OCDDate: "30/JUN/2024",
          image: "/assets/images/09.png",
          name: "Brightening CC Foundation",
          size: "N/A",
          description: "New radiant foundation- supercharged as a serum, lightweight as a skin tint, and glowy as youthful skin.",
          brandLogo: "/assets/images/Byterry_logo.png",
        },

        {
          brand: "RMS Beauty",
          date: "09/MAY/2024",
          OCDDate: "06/JUN/2024",
          image: "/assets/images/06.png",
          name: "Re Dimension Hydra",
          size: "30 ml",
          description: "It glides on effortlessly, infusing skin with multi-dimensional life as the bouncy, light-as-air gel blends and builds color.",
          brandLogo: "/assets/images/rms-beauty.png",
        },

        {
          brand: "Bobbi Brown",
          date: "01/Apr/2024",
          OCDDate: "05/May/2024",
          image: "/assets/images/Smoothing5.png",
          name: "Extra Lip Serum",
          size: "N/A",
          description: " This plump lip serum is very comfortable. No stinging , burning or cooling. My lips feel moisturized and look more plump due to the high shine",
          brandLogo: "/assets/images/BobbyBrown.png",
        },

        {
          brand: "Byredo",
          date: "01/Apr/2024",
          OCDDate: "05/May/2024",

          image: "/assets/images/Smoothing11.png",
          name: "Mojave Ghost Solid",
          size: "3g",
          description: "Mojave Ghost is a captivating and woody fragrance that draws inspiration from the soulful beauty of the Mojave Desert.",
          brandLogo: "/assets/images/Byredo.png",
        },

        {
          brand: "Byredo",
          date: "TBD/Apr/2024",
          OCDDate: "02/May/2024",
          image: "/assets/images/Smoothing18.png",
          name: "The Lipstick – Satin",
          size: "N/A",
          description: "A satin finish to reflect light and expand the colour. Vegan formula. Colour rich with an exceptional formulation that is both comfortable.",
          brandLogo: "/assets/images/Byredo.png",
        },
        // Add more products for February
      ],
    },
    {
      month: "JUN",
      content: [
        {
          brand: "Kevyn Aucoin Cosmetics",
          date: "01/JUN/2024",
          OCDDate: "10/JUL/2024",
          image: "/assets/images/13.png",
          name: "Contour Book The Art of Sculpting",
          size: "N/A",
          description: "New radiant foundation- supercharged as a serum, lightweight as a skin tint, and glowy as youthful skin.",
          brandLogo: "/assets/images/kevy_logo.png",
        },
        {
          brand: "Byredo",
          date: "01/May/2024",
          OCDDate: "01/Jun/2024",

          image: "/assets/images/Smoothing12.png",
          name: "Mojave Ghost Alcohol",
          size: "100 ml",
          description: "Roll-on Perfumed Oil delivers an intense hit of fragrance with a long-lasting effect, in an alcohol-free formulation.",
          brandLogo: "/assets/images/Byredo.png",
        },

        {
          brand: "Byredo",
          date: "TBD/May/2024",
          OCDDate: "06/Jun/2024",
          image: "/assets/images/Smoothing19.png",
          name: "Mojave Ghost Eyeshadow",
          size: "N/A",
          description: "Mojave Ghost is a woody composition inspired by the soulful beauty of the Mojave Desert.",
          brandLogo: "/assets/images/Byredo.png",
        },

        {
          brand: "Diptyque",
          date: "TBD/2024",
          OCDDate: "04/Jun/2024",
          image: "/assets/images/Smoothing24.png",
          name: "Citronnelle ",
          size: "109g",
          description: "The Diptyque Body Spray Citronnelle & Geranium is an aromatic, floral fragrance with essential oils that also works as a mosquito repellent.",
          brandLogo: "/assets/images/Diptuque.png",
        },

        {
          brand: "ReVive",
          date: "01/Jun/2024",
          OCDDate: "ASAP",
          image: "/assets/images/Smoothing26.png",
          name: "Advanced Lip Perioral Serum Reformulation",
          size: "15g",
          description: "Lip & Perioral Renewal Serum is a targeted treatment for the lip area, specifically designed to fight against the appearance of vertical lines.",
          brandLogo: "/assets/images/revive.png",
        },
        {
          brand: "ESTEE LAUDER",
          date: "03/Jun/2024",
          OCDDate: "15/JUL/2024",
          image: "/assets/images/23.png",
          name: "Revitalizing Supreme+ Youth Power Crème ",
          size: "15g",
          description: "An infusion of Cactus Stem Cell Extract and Hyaluronic Acid helps reveal stronger, nourished skin, saturated",
          brandLogo: "/assets/images/estee-Logo.png",
        },

        // Add more products for February
      ],
    },
    {
      month: "AUG",
      content: [
        {
          brand: "Kevyn Aucoin Cosmetics",
          date: "TBD/AUG/2024",
          OCDDate: "TBD/SEP/2024",
          image: "/assets/images/14.png",
          name: "New Naked Skin Tint ",
          size: "N/A",
          description: "Get tinted sheer to light coverage for a natural finish that feels like you're wearing next to nothing when you use Stripped Nude Skin Tint by Kevyn Aucoin.",
          brandLogo: "/assets/images/kevy_logo.png",
        },

        {
          brand: "Byredo",
          date: "TBD/Jul/2024",
          OCDDate: "29/Aug/2024",
          image: "/assets/images/Smoothing13.png",
          name: "TBD Candle",
          size: "240 g",
          description: "Our best-selling candles are crafted in elegant smoked black glass, featuring black wax and wicks.",
          brandLogo: "/assets/images/Byredo.png",
        },

        {
          brand: "Byredo",
          date: "TBD/Jul/2024",
          OCDDate: "22/Aug/2024",
          image: "/assets/images/Smoothing20.png",
          name: "The Lipstick – Satin ",
          size: "N/A",
          description: "A satin finish to reflect light and expand the colour. Vegan formula. Colour rich with an exceptional formulation that is both comfortable.",
          brandLogo: "/assets/images/Byredo.png",
        },

        // Add more products for February
      ],
    },
    {
      month: "SEP",
      content: [
        {
          brand: "Kevyn Aucoin Cosmetics",
          date: "TBD/SEP/2024",
          OCDDate: "TBD/OCT/2024",
          image: "/assets/images/15.png",
          name: "Celestial Lipgloss ",
          size: "N/A",
          description: "Our Celestial lip gloss is a plumbing lip gloss that is clear but has an iridescent pigment to it.",
          brandLogo: "/assets/images/kevy_logo.png",
        },

        {
          brand: "Byredo",
          date: "TBD/Aug/2024",
          OCDDate: "TBD/Sep/2024",
          image: "/assets/images/Smoothing15.png",
          name: "Mojave Ghost Absolu",
          size: "50 ml",
          description: "Mojave Ghost is a woody composition inspired by the soulful beauty of the Mojave Desert. In this xeric wilderness, rare are the plants that dare to blossom.",
          brandLogo: "/assets/images/Byredo.png",
        },

        // Add more products for February
      ],
    },
    {
      month: "OCT",
      content: [
        {
          brand: "Byredo",
          date: "TBD/Sep/2024",
          OCDDate: "03/Oct/2024",
          image: "/assets/images/Smoothing14.png",
          name: "Fall EDP",
          size: "50 ml",
          description: "Fall for the transition. The cocooning and compelling Eyes Closed, our new Eau de Parfum.",
          brandLogo: "/assets/images/Byredo.png",
        },
      ],
    },
    {
      month: "NOV",
      content: [
        {
          brand: "ESTEE LAUDER",
          date: "28/NOV/2023",
          OCDDate: "02/JAN/2024",
          image: "/assets/images/20.png",
          name: "Beautiful Magnolia Travel Spray",
          size: "10 ml",
          description: "A hypnotic blend with signature notes of lush Magnolia, solar Gardenia, warm Woods and luminous Musk. Romantic, feminine and radiant",
          brandLogo: "/assets/images/estee-Logo.png",
        },

        // Add more products for February
      ],
    },
    {
      month: "DEC",
      content: [
        {
          brand: "Maison Margiela",
          date: "01/DEC/2023",
          OCDDate: "01/JAN/2024",

          image: "/assets/images/17.png",
          name: "Under The Stars EDT ",
          size: "200 ml",
          description: "Under the Stars by Maison Martin Margiela is a Amber Woody fragrance for women and men.",
          brandLogo: "/assets/images/maisonMargilia_logo.png",
        },
        
        {
          brand: "Re-Nutriv",
          date: "04/DEC/2023",
          OCDDate: "15/JAN/2024",
          image: "/assets/images/26.png",
          name: "Re Nutriv Ultimate Diamond Brilliance Crème ",
          size: "30 ml",
          description: "Ultimate Diamond Transformative Brilliance Serum · Re-Nutriv. Ultimate Diamond Transformative Energy Eye Creme · Re-Nutriv.",
          brandLogo: "/assets/images/renutrive-logo.png",
        },
        {
          brand: "Re-Nutriv",
          date: "04/DEC/2023",
          OCDDate: "15/JAN/2024",
          image: "/assets/images/26.png",
          name: "Re Nutriv Ultimate Diamond Brilliance Crème ",
          size: "50 ml",
          description: "Ultimate Diamond Transformative Brilliance Serum · Re-Nutriv. Ultimate Diamond Transformative Energy Eye Creme · Re-Nutriv.",
          brandLogo: "/assets/images/renutrive-logo.png",
        },
        {
          brand: "ESTEE LAUDER",
          date: "05/DEC/2023",
          OCDDate: "16/JAN/2024",
          image: "/assets/images/21.png",
          name: "Double Wear Smooth & Blur Primer ",
          size: "40 ml",
          description: "This body lotion is nourishing and moisturizing thanks to a complex of hydrating agents, shea butter, colza oil & vegetal glycerin.",
          brandLogo: "/assets/images/estee-Logo.png",
        },
        {
          brand: "ESTEE LAUDER",
          date: "11/DEC/2023",
          OCDDate: "22/JAN/2024",
          image: "/assets/images/22.png",
          name: "Explicit Slick Shine Lipstick",
          size: "N/A",
          description: "High-intensity shine lipstick. Explicit color in one swipe. 8-hour wear. All-day dare.",
          brandLogo: "/assets/images/estee-Logo.png",
        },
        {
          brand: "AERIN",
          date: "11/DEC/2023",
          OCDDate: "01/FEB/2024",
          image: "/assets/images/24.png",
          name: "Mediterranean Honeysuckle Tiare",
          size: "50 ml",
          description: "Mediterranean Honeysuckle limited editions have always been inspired by traveling to one of my favorite places in the world.",
          brandLogo: "/assets/images/Aren-logo.png",
        },
        {
          brand: "Maison Margiela",
          date: "15/DEC/2023",
          OCDDate: "01/JAN/2024",
          image: "/assets/images/16.png",
          name: "Body Lotion",
          size: "200 ml",
          description: "This body lotion is nourishing and moisturizing thanks to a complex of hydrating agents, shea butter, colza oil & vegetal glycerin.",
          brandLogo: "/assets/images/maisonMargilia_logo.png",
        },
        {
          brand: "Maison Margiela",
          date: "15/DEC/2023",
          OCDDate: "01/JAN/2024",
          image: "/assets/images/16.png",
          name: "Shower Gel",
          size: "200 ml",
          description: "Shower Gels boast a texture with elasticity and protective properties and are also suitable for sensitive and delicate skin.",
          brandLogo: "/assets/images/maisonMargilia_logo.png",
        },
        {
          brand: "Maison Margiela",
          date: "15/DEC/2023",
          OCDDate: "01/JAN/2024",
          image: "/assets/images/16.png",
          name: "Hand Cream",
          size: "30 ml",
          description: "Love this cream because it leaves my hands feeling soft with no slimy feeling.",
          brandLogo: "/assets/images/maisonMargilia_logo.png",
        },

        // Add more products for February
      ],
    },
  ])
  let brands = [
    { value: null, label: "All" },
    { value: "Susanne Kaufmann", label: "Susanne Kaufmann" },
    { value: "AERIN", label: "AERIN" },
    { value: "ARAMIS", label: "ARAMIS" },
    { value: "Bobbi Brown", label: "Bobbi Brown" },
    { value: "Bumble and Bumble", label: "Bumble and Bumble" },
    { value: "Byredo", label: "Byredo" },
    { value: "BY TERRY", label: "BY TERRY" },
    { value: "Diptyque", label: "Diptyque" },
    { value: "Kevyn Aucoin Cosmetics", label: "Kevyn Aucoin Cosmetics" },
    { value: "ESTEE LAUDER", label: "ESTEE LAUDER" },
    { value: "L'Occitane", label: "L'Occitane" },
    { value: "Maison Margiela", label: "Maison Margiela" },
    { value: "ReVive", label: "ReVive" },
    { value: "RMS Beauty", label: "RMS Beauty" },
    { value: "Smashbox", label: "Smashbox" },
    { value: "Re-Nutriv", label: "Re-Nutriv" },
    { value: "Victoria Beckham Beauty", label: "Victoria Beckham Beauty" },
  ];
  const [month, setMonth] = useState("");
  let months = [
    { value: null, label: "All" },
    { value: "JAN", label: "JAN" },
    { value: "FEB", label: "FEB" },
    { value: "MAR", label: "MAR" },
    { value: "APR", label: "APR" },
    { value: "MAY", label: "MAY" },
    { value: "JUN", label: "JUN" },
    { value: "JULY", label: "JULY"},
    { value: "AUG", label: "AUG" },
    { value: "SEP", label: "SEP" },
    { value: "OCT", label: "OCT" },
    { value: "NOV", label: "NOV" },
    { value: "DEC", label: "DEC" },
    { value: "TBD", label: "TBD" },

  ];
  const generatePdf = () => {
    const element = document.getElementById('CalenerContainer'); // The HTML element you want to convert
    // element.style.padding = "10px"
    let filename = `Marketing Calender `;
    if (brand) {
      filename = brand + " "
    }
    filename += new Date();
    const opt = {
      margin: 1,
      filename: filename + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      // jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const generateXLSX = () => {
    const newValues = productList?.map((months) => {
      const filterData = months.content?.filter((item) => {
        // let match = item.OCDDate.split("/")
        // console.log(match)
        if (month) {
          if (brand) {
            if (brand == item.brand) {
              return item.date.toLowerCase().includes(month.toLowerCase())
            }
          } else {
            return item.date.toLowerCase().includes(month.toLowerCase())
          }
          // return match.includes(month.toUpperCase() )
        } else {
          if (brand) {
            if (brand == item.brand) {
              return true;
            }
          } else {
            return true;
          }
          // If month is not provided, return all items
        }
      });
        // Create a new object with filtered content
        return { ...months, content: filterData };
    });
    let fileData = exportToExcel({list:newValues});
  }
  
  const csvData = ({data}) => {
    let finalData = [];
    if (data.length) {
      data?.map((ele) => {
        if(ele.content.length){
          ele.content.map((item)=>{
            let temp = {};
            temp["MC Month"] = ele.month;
            temp["Product Title"] = item.name;
            temp["Product Description"] = item.description;
            temp["Product Size"] = item.size;
            temp["Product Ship Date"] = item.date;
            temp["Product OCD Date"] = item.OCDDate;
            temp["Product Brand"] = item.brand;
            finalData.push(temp);
          })
        }
      });
    }
    return finalData;
  };
  const exportToExcel = ({list}) => {
    const ws = XLSX.utils.json_to_sheet(csvData({data:list}));
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    let filename = `Marketing Calender`;
    if (brand) {
      filename = brand
    }
    FileSaver.saveAs(data, `${filename} ${new Date()}` + fileExtension);
  };
  
  return (
    <AppLayout
      filterNodes={
        <>
          <FilterItem
            minWidth="220px"
            label="All Brand"
            name="All-Brand"
            value={brand}
            options={brands}
            onChange={(value) => {
              setBrand(value);
            }}
          />
          <FilterItem
            minWidth="220px"
            label="JAN-DEC"
            name="JAN-DEC"
            value={month}
            options={months}
            onChange={(value) => {
              setMonth(value);
            }}
          />
          <button
            className="border px-2.5 py-1 leading-tight"
            onClick={() => {
              setBrand("");
              setMonth(null);
            }}
          >
            CLEAR ALL
          </button>
          <div className="dropdown dropdown-toggle border px-2.5 py-1 leading-tight d-flex" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            <MdOutlineDownload size={16} />&nbsp;Download
            <ul className="dropdown-menu">
              <li>
                <div className="dropdown-item text-start" onClick={() => generatePdf()}>&nbsp;Pdf</div>
              </li>
              <li>
                <div className="dropdown-item text-start" onClick={()=>generateXLSX()}>&nbsp;XLSX</div>
              </li>
            </ul>
          </div>
        </>
      }
    >
      <LaunchCalendar brand={brand} month={month} productList={productList}/>
    </AppLayout>
  );
};

export default MarketingCalendar;
