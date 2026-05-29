import React, { useState, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './EventSetup.css'
import { assets } from '../../assets/assets'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

/* ─── ALL Data ───────────────────────────────────────────── */
const ALL_TENTS = [
  { id: 'tent1', image: 'tent1', label: 'Halnet' },
  { id: 'tent2', image: 'tent2', label: '6X6m Banquet Catering Conference Tent' },
  { id: 'tent3', image: 'tent3', label: "Pocotex's" },
  { id: 'tent4', image: 'tent4', label: 'High Peak Party Tent' },
  { id: 'tent5', image: 'tent5', label: 'Blue Tent' },
  { id: 'tent6', image: 'tent6', label: 'White Tent' },
  { id: 'tent7', image: 'tent7', label: 'Wide Tent' },
  { id: 'tent8', image: 'tent8', label: 'Red Tent' },
]

const ALL_TABLES = [
  { id: 'table1', image: 'table1', label: 'Classical Elegance', elements: { style: 'Neoclassical Italian', colors: 'Cream, ivory, and soft taupe', lighting: 'Ornate gold crystal chandeliers', vibe: 'Traditional, formal, and high-end luxury' } },
  { id: 'table3', image: 'table3', label: 'Modern Glamour', elements: { style: 'Contemporary, bold luxury', colors: 'Midnight black, metallic gold, and white', lighting: 'Warm ambient light reflected by metallic surfaces', vibe: 'Dramatic, high-fashion, and upscale celebratory' } },
  { id: 'table4', image: 'table4', label: 'Fairytale Romance', elements: { style: 'Traditional, whimsical wedding classic', colors: 'Monochromatic stark white, ivory, and soft cream', lighting: 'Bright, natural outdoor daylight', vibe: 'Soft, dreamlike, and ultra-romantic' } },
  { id: 'table5', image: 'table5', label: 'Timeless Chic', elements: { style: 'Refined European garden traditional', colors: 'Warm gold, ivory, and soft white', lighting: 'Soft, natural open-air daylight', vibe: 'Sophisticated, clean, and effortlessly elegant' } },
  { id: 'table6', image: 'table6', label: 'Rustic Harvest', elements: { style: 'Organic, earthy, and country-inspired', colors: 'Ochre yellow, warm beige, burlap brown, and sage green', lighting: 'Cozy, diffused outdoor ambient light', vibe: 'Warm, welcoming, and nature-connected' } },
  { id: 'table7', image: 'table7', label: 'Enchanted Forest', elements: { style: 'Immersive, whimsical fairy tale fantasy', colors: 'Deep forest green, midnight blue, warm gold, and glowing white', lighting: 'Shimmering crystal chandeliers, fairy lights, and illuminated butterflies', vibe: 'Mystical, magical, and dreamlike' } },
  { id: 'table8', image: 'table8', label: 'Corporate Casual', elements: { style: 'Functional, practical conference or seminar banquet', colors: 'Deep burgundy, warm terracotta, crisp white, and silver', lighting: 'Bright, direct indoor daylight from large windows', vibe: 'Professional, straightforward, and organized' } },
  { id: 'table9', image: 'table9', label: 'Festive Celebration', elements: { style: 'High-energy, casual party or award ceremony', colors: 'Vibrant crimson red, bright white, and shimmering silver', lighting: 'Warm, dim indoor pendant lighting contrasted with bright balloon accents', vibe: 'Lively, cheerful, and celebratory' } },
]

const ALL_BOFFIES = [
  { id: 'boffie1', image: 'boffie1', label: 'Oceanic Elegance', elements: { style: 'Ornate, heavily styled thematic catering display', colors: 'Royal blue, sky blue, stark white, and lush botanical green', lighting: 'Warm teardrop pendant lamps filtering through hanging wisteria', vibe: 'Grand, vivid, and highly stylized' } },
  { id: 'boffie2', image: 'boffie2', label: 'Boho Harvest', elements: { style: 'Warm, natural, and texture-focused artisanal display', colors: 'Mustard yellow, earthy brown, sage green, and clean white', lighting: 'Soft, indirect indoor illumination highlighting metallic details', vibe: 'Cozy, relaxed, and craft-inspired' } },
  { id: 'boffie3', image: 'boffie3', label: 'Golden Hospitality', elements: { style: 'Professional hotel-grade catering with vibrant accents', colors: 'Warm gold, polished silver, stark white, and sunflower yellow', lighting: 'Direct heating lamps casting a focused, warm glow over the food', vibe: 'Welcoming, polished, and functionally upscale' } },
  { id: 'boffie4', image: 'boffie4', label: 'Rustic Industrial', elements: { style: 'Organic, modern grazing station with raw structural elements', colors: 'Lush botanical green, warm wood brown, natural hemp rope beige, and amber gold', lighting: 'Exposed Edison bulbs suspended by thick ropes, casting a soft, warm glow', vibe: 'Chic, artisanal, and intimately cozy' } },
  { id: 'boffie5', image: 'boffie5', label: 'Classic Catering', elements: { style: 'Traditional, no-frills institutional buffet line', colors: 'Deep maroon tablecloth, polished silver chafing dishes, and clean white porcelain plates', lighting: 'Natural daylight from adjacent windows mixed with standard indoor lighting', vibe: 'Functional, orderly, and straightforward' } },
  { id: 'boffie6', image: 'boffie6', label: 'Rustic Romance', elements: { style: 'Charming, soft pastoral design set against an industrial backdrop', colors: 'Deep burgundy skirters, pastel peach roses, sunny golden rice/grain stalks, and crisp white urns', lighting: 'Warm, glowing overhead basket lanterns interwoven with faux green vines', vibe: 'Festive, cozy, and elegantly rustic' } },
  { id: 'boffie7', image: 'boffie7', label: 'Baroque Royalty', elements: { style: 'Ornate, traditional celebratory buffet with classical statuary', colors: 'Royal blue, crisp white, metallic gold, and soft pastel purple flowers', lighting: 'Bright, natural open-air indoor daylight from background windows', vibe: 'Grand, traditional, and distinctly formal' } },
  { id: 'boffie8', image: 'boffie8', label: 'Royal Grandeur', elements: { style: 'Traditional, symmetrical catering display featuring heavy fabric swagging', colors: 'Royal blue, crisp white, and vibrant pastel pink flowers', lighting: 'Bright, recessed ceiling spotlights paired with natural light from large background windows', vibe: 'Formal, celebratory, and distinctly classic' } },
]

const COLOR_PALETTES = [
  { id: 'blush',    color: '#f7c4d4', label: 'Blush pink' },
  { id: 'sky',      color: '#c9e8f0', label: 'Sky blue' },
  { id: 'sage',     color: '#d4edda', label: 'Sage green' },
  { id: 'gold',     color: '#f5e6c8', label: 'Gold / champagne' },
  { id: 'lavender', color: '#e8d5f0', label: 'Lavender' },
  { id: 'peach',    color: '#ffd3b6', label: 'Peach / coral' },
  { id: 'steel',    color: '#b0c4de', label: 'Steel blue' },
  { id: 'white',    color: '#f5f5f5', label: 'White / neutral', border: true },
]

const ALL_SKIRTINGS = [
  { id: 'Skirting1', image: 'Skirting1', label: 'Classic Gold Swag Draping', elements: { style: 'Traditional, dramatic catering display featuring heavy fabric swagging.', colors: 'Deep onyx black, antique gold, stark white, and soft pastel pink.', lighting: 'Warm, direct indoor lighting highlighting the sheen of the satin drapes.', vibe: 'Formal, majestic, and traditionally upscale.' } },
  { id: 'Skirting2', image: 'Skirting2', label: 'Artisanal Rose Quartz Glamour', elements: { style: 'Intricate, highly textured artisanal table smocking and pleating.', colors: 'Dusty rose pink, metallic champagne, and matte black.', lighting: 'Dim, ambient indoor lighting reflecting off the satin fabric sheen.', vibe: 'Elaborate, unique, and traditionally detailed.' } },
  { id: 'Skirting3', image: 'Skirting3', label: 'Royal Violet Diamond Smocking', elements: { style: 'Intricate, geometric lattice smocking and hand-pleated satin table skirting.', colors: 'Deep violet purple, vibrant golden yellow, and festive carpet red.', lighting: 'Warm stage lighting catching the high-shine reflections of the satin fabric.', vibe: 'Festive, theatrical, regal, and culturally rich' } },
  { id: 'Skirting4', image: 'Skirting4', label: 'Classic Blue Swag Draping', elements: { style: 'Traditional, high-volume ceremonial fabric draping with rosette floral clusters.', colors: 'Royal sapphire blue, crisp ivory white, and emerald green foliage.', lighting: 'Diffused indoor ambient light casting soft shadows on the tulle sweeps.', vibe: 'Formal, celebratory, and classically uniform.' } },
  { id: 'Skirting5', image: 'Skirting5', label: 'Lilac Honeycomb Elegance', elements: { style: 'Complex, hand-crafted honeycomb smocking and structured satin table skirting.', colors: 'Soft lavender purple, deep chocolate brown, and matte black.', lighting: 'Warm, subdued indoor lighting reflecting off the geometric satin folds.', vibe: 'Articulate, structured, and traditionally formal.' } },
  { id: 'Skirting6', image: 'Skirting6', label: 'Classic Maroon Swag Draping', elements: { style: 'Traditional, structured catering display featuring heavy fabric swagging over vertical box pleats.', colors: 'Deep crimson maroon, warm natural wood brown, and matte black.', lighting: 'Soft, diffused indoor residential lighting catching the high-sheen satin reflections.', vibe: 'Formal, classic, and traditionally elegant.' } },
  { id: 'Skirting7', image: 'Skirting7', label: 'Winter Wonderland Shimmer', elements: { style: 'Ornate, romantic dessert station with structured symmetrical draping.', colors: 'Metallic champagne taupe, crisp ivory white, and warm parquet wood brown.', lighting: 'Soft, warm indoor ambient lighting reflecting off the high-sheen satin fabrics.', vibe: 'Dreamlike, elegant, sophisticated, and celebratory.' } },
  { id: 'Skirting8', image: 'Skirting8', label: 'Silver Sequin Winter Elegance', elements: { style: 'Modern luxurious wedding stage setup featuring mixed textile draping.', colors: 'Shimmering metallic silver, crisp white, soft ivory, and deep botanical green.', lighting: 'Bright, reflective indoor event lighting bouncing off sequined surfaces.', vibe: 'Grand, sparkling, romantic, and highly theatrical.' } },
]

const ALL_CHAPINGDISHES = [
  { id: 'Chapingdish1',  image: 'Chapingdish1',  label: 'Roll-Top Chafing Dish', elements: { style: 'Rectangular, featuring a 180-degree roll-top dome lid, square supportive legs, and an integrated bottom shelf holding dual gel fuel canisters.' } },
  { id: 'Chapingdish2',  image: 'Chapingdish2',  label: 'Glass Window Roll-Top Chafing Dish', elements: { style: 'Rectangular, featuring a curved dome roll-top lid with an integrated rectangular clear viewing window, a wide ergonomic handle, and a polished chrome frame with dual fuel holder slots.' } },
  { id: 'Chapingdish3',  image: 'Chapingdish3',  label: 'Round Glass Window Roll-Top Chafing Dish', elements: { style: 'Spherical or round, featuring a clear circular glass viewing window integrated into a 180-degree roll-top dome lid, anchored on a sturdy three-legged chrome base holding a single gel fuel canister.' } },
  { id: 'Chapingdish4',  image: 'Chapingdish4',  label: 'Round Roll-Top Chafing Dish', elements: { style: 'Cylindrical and circular, featuring a retractable half-dome roll-top lid with a T-shaped top handle, resting on a heavy-duty three-legged stainless steel frame with a single central fuel burner.' } },
  { id: 'Chapingdish5',  image: 'Chapingdish5',  label: 'Round Gold-Accented Lift-Off Lid Chafing Dish', elements: { style: 'Perfectly circular, featuring a removable high-dome lift-off lid with a gold top knob, two gold side handles, and a polished stainless steel body supported by a sleek, gold-plated three-legged frame with a single central fuel holder.' } },
  { id: 'Chapingdish6',  image: 'Chapingdish6',  label: 'Gold Hydraulic Glass Window Chafing Dish', elements: { style: 'Rectangular, featuring a high-gloss polished gold frame, an integrated clear glass viewing window on a hinged lid, a contrast stainless steel food pan, and elegant curved cabriole-style gold legs.' } },
  { id: 'Chapingdish7',  image: 'Chapingdish7',  label: 'Round Gold Glass Window Roll-Top Chafing Dish', elements: { style: 'Spherical or round, featuring a fully integrated retractable dome lid, an oval glass viewing window at the top, an ergonomic T-shaped gold handle, a contrast stainless steel inner food pan, and a matching three-legged polished gold base frame with a central fuel holder.' } },
  { id: 'Chapingdish8',  image: 'Chapingdish8',  label: 'Rectangular Gold Hydraulic Glass Window Chafing Dish', elements: { style: 'Clean rectangular, featuring a flat-top hinged lid with a large clear glass viewing window, a sleek integrated horizontal bar handle, and wide, minimalist square-block gold legs that provide a heavy, stable base.' } },
  { id: 'Chapingdish9',  image: 'Chapingdish9',  label: 'Rectangular Gold Filigree Glass Buffet Warmer', elements: { style: 'Shallow rectangular, featuring a removable heat-resistant clear glass baking dish pan, an open filigree lace pattern metal frame wrapper, two side wire loop handles, and a polished gold lift-off lid with an oval multi-tier top knob.' } },
  { id: 'Chapingdish10', image: 'Chapingdish10', label: 'Rectangular Speckled Black and Gold Chafing Dish', elements: { style: 'Rectangular, featuring a matte black exterior finish textured with white/silver starry speckles, a contrasting polished gold accent bar, a gold lift-off lid with an integrated horizontal top handle, and a sturdy four-legged base housing dual fuel canisters.' } },
  { id: 'Chapingdish11', image: 'Chapingdish11', label: 'Matte Black Hydraulic Glass Window Chafing Dish', elements: { style: 'Rectangular, featuring a smooth matte black coated body, an integrated transparent glass viewing window on a slow-closing hydraulic hinge lid, a thin chrome accent rim, an attached horizontal side handle for ease of placement, and matching angular black supportive legs.' } },
]

const ALL_MOTIFS = [
  { id: 'Motif1',  image: 'Motif1',  label: 'Dramatic Gothic Romance', elements: { style: 'High-contrast, theatrical event design.', colors: 'Crimson red, deep onyx black, and crisp white.', lighting: 'Ambient crystal candelabras with flickering candlelight.', vibe: 'Bold, passionate, dramatic, and formally sophisticated.' } },
  { id: 'Motif2',  image: 'Motif2',  label: 'Festive Christmas Wonderland', elements: { style: 'Playful, holiday-themed corporate party.', colors: 'Emerald green, ruby red, stark white, and metallic silver.', lighting: 'Warm overhead chandelier light mixed with bright stage lighting.', vibe: 'Cheerful, high-energy, nostalgic, and immersive.' } },
  { id: 'Motif3',  image: 'Motif3',  label: 'Black and Gold Opulence', elements: { style: 'Bold, high-contrast glamorous luxury.', colors: 'Deep onyx black, shimmering metallic gold, and crisp white.', lighting: 'Warm LED tube candles reflecting off sequined fabrics.', vibe: 'Regal, celebratory, dramatic, and upscale.' } },
  { id: 'Motif4',  image: 'Motif4',  label: 'Classic Black & Gold Gala', elements: { style: 'Traditional, high-volume formal event design.', colors: 'Deep onyx black, antique gold, and stark white.', lighting: 'Standard overhead arena or large hall lighting.', vibe: 'Formal, organized, school-spirited, and highly uniform.' } },
  { id: 'Motif5',  image: 'Motif5',  label: 'Modern Black, Gold, and White Elegance', elements: { style: 'Sleek, modern, and highly contrasted celebratory setup.', colors: 'Deep matte black, shimmering metallic gold, and crisp white.', lighting: 'Warm, glowing floating tea candles casting reflections on sequins.', vibe: 'Chic, intimate, sophisticated, and polished.' } },
  { id: 'Motif6',  image: 'Motif6',  label: 'Amalfi Coast Chic', elements: { style: 'Refined, European al fresco garden wedding design.', colors: 'Royal blue, crisp porcelain white, and botanical green.', lighting: 'Warm overhead festoon string lights mixed with golden hour sunset.', vibe: 'Romantic, breezy, sophisticated, and effortlessly luxurious.' } },
  { id: 'Motif7',  image: 'Motif7',  label: 'Classic Toile Romance', elements: { style: 'Refined, elegant, and classic European marquee design.', colors: 'Dusty blue, slate blue, ivory, and soft grey-wash wood tones.', lighting: 'Soft ambient glow from glass chimney taper candles and warm overhead marquee draping lights.', vibe: 'Grand, intimate, sophisticated, and deeply romantic.' } },
  { id: 'Motif8',  image: 'Motif8',  label: 'Classic Midnight & Rose Gala', elements: { style: 'Traditional, structured formal banquet layout.', colors: 'Deep navy blue, soft blush pink, stark white, and botanical green.', lighting: 'Warm indoor ambient light with direct focus on the tablescapes.', vibe: 'Classic, elegant, uniform, and welcoming.' } },
  { id: 'Motif9',  image: 'Motif9',  label: 'Royal Crimson Gala', elements: { style: 'Rich, traditional ballroom luxury.', colors: 'Deep burgundy red, sparkling metallic gold, and crisp white', lighting: 'Bright, glamorous crystal starburst chandeliers reflecting off sequined runners.', vibe: 'Grand, celebratory, regal, and deeply festive.' } },
  { id: 'Motif10', image: 'Motif10', label: 'Warm Amber Elegance', elements: { style: 'Cozy, lodge-style rustic charm with a refined finish.', colors: 'Warm amber yellow, cream white, rustic terracotta, and natural wood brown.', lighting: 'Zigzagging festoon string lights mixed with glowing warm white fairy lights on the background drapery.', vibe: 'Hearty, welcoming, romantic, and beautifully warm.' } },
  { id: 'Motif11', image: 'Motif11', label: 'Imperial Gold & White Luxury', elements: { style: 'High-end, formal European ballroom opulence.', colors: 'Warm champagne gold, metallic gold, crisp white, and deep botanical green.', lighting: 'Stately crystal chandeliers casting a bright overhead glow, paired with intimate clusters of pillar candles at the table base.', vibe: 'Majestic, ultra-luxurious, romantic, and highly sophisticated.' } },
  { id: 'Motif12', image: 'Motif12', label: 'Emerald & Gold Botanical', elements: { style: 'Modern, crisp, and high-contrast botanical luxury.', colors: 'Deep emerald green, metallic gold, stark white, and soft blush pink accents.', lighting: 'Bright indoor event lighting reflecting off metallic charger plates and sequined runners.', vibe: 'Fresh, elegant, regal, and celebratory.' } },
  { id: 'Motif13', image: 'Motif13', label: 'Rose Gold Glamour', elements: { style: 'Playful, sparkling, and feminine celebratory design.', colors: 'Blush pink, shimmering metallic gold, and clean white.', lighting: 'Soft, warm candlelight from floating candle cylinders reflecting off sequins.', vibe: 'Festive, glamorous, sweet, and highly energetic.' } },
  { id: 'Motif14', image: 'Motif4',  label: 'Spider-Man Superhero Adventure.', elements: { style: 'Immersive, high-energy children character party.', colors: 'Royal blue, crimson red, spider-web black, and metallic gold accents.', lighting: 'Bright, natural outdoor daylight showcasing bold primary colors.', vibe: 'Playful, dynamic, heroic, and action-packed.' } },
  { id: 'Motif15', image: 'Motif15', label: 'Royal Purple & Gold Majesty', elements: { style: 'Modern regal luxury with high-contrast floral styling', colors: 'Deep royal purple, metallic gold, crisp white, and soft lavender.', lighting: 'Integrated purple neon ceiling cove lights paired with a dramatic cascading crystal chandelier and warm tabletop candlelight.', vibe: 'Majestic, high-end, sophisticated, and deeply atmospheric.' } },
  { id: 'Motif16', image: 'Motif16', label: 'Lavender & Emerald Opulence', elements: { style: 'Modern regal, color-blocked high-end event styling.', colors: 'Deep lavender purple, emerald green, metallic gold, and white.', lighting: 'Soft purple wall uplighting paired with a crystal drum chandelier and ambient table candles.', vibe: 'Luxurious, atmospheric, unique, and deeply dramatic.' } },
  { id: 'Motif17', image: 'Motif17', label: 'Lavender & Silver Satin Elegance', elements: { style: 'Traditional, high-volume celebration or community banquet design.', colors: 'Soft lavender purple, metallic silver, and crisp white.', lighting: 'Bright, standard indoor overhead hall lighting.', vibe: 'Clean, uniform, cheerful, and budget-friendly.' } },
]

const ALL_FOODS = [
  { id: 'FOODS1',  image: 'FOODS1',  label: 'Fish Fillet',         elements: null },
  { id: 'FOODS2',  image: 'FOODS2',  label: 'Lasagna',             elements: null },
  { id: 'FOODS3',  image: 'FOODS3',  label: 'Pork Steak',          elements: null },
  { id: 'FOODS4',  image: 'FOODS4',  label: 'Fried Chicks',        elements: null },
  { id: 'FOODS5',  image: 'FOODS5',  label: 'Menudong Baboy',      elements: null },
  { id: 'FOODS6',  image: 'FOODS6',  label: 'Sea Foods',           elements: null },
  { id: 'FOODS7',  image: 'FOODS7',  label: 'Bam-i',               elements: null },
  { id: 'FOODS8',  image: 'FOODS8',  label: 'Humba',               elements: null },
  { id: 'FOODS9',  image: 'FOODS9',  label: 'Chicken Cordon bleu', elements: null },
  { id: 'FOODS10', image: 'FOODS10', label: 'Spaghetti',           elements: null },
  { id: 'FOODS11', image: 'FOODS11', label: 'Chicken Caldereta',   elements: null },
]

const ALL_DESSERTS = [
  { id: 'Dessert1', image: 'Dessert1', label: 'Buko Pandan',         elements: null },
  { id: 'Dessert2', image: 'Dessert2', label: 'Mango Tapioca',       elements: null },
  { id: 'Dessert3', image: 'Dessert3', label: 'Fruit Salad',         elements: null },
  { id: 'Dessert4', image: 'Dessert4', label: 'Macaroni Salad',      elements: null },
  { id: 'Dessert5', image: 'Dessert5', label: 'Choco Cupcake',       elements: null },
  { id: 'Dessert6', image: 'Dessert6', label: 'Dark Chocolate Cake', elements: null },
  { id: 'Dessert7', image: 'Dessert7', label: 'Ice Creame',          elements: null },
  { id: 'Dessert8', image: 'Dessert8', label: 'Pinoy Halo-Halo',     elements: null },
]

const ALL_DRINKS = [
  { id: 'Drinks1', image: 'Drinks1', label: 'Coke',         elements: null },
  { id: 'Drinks2', image: 'Drinks2', label: 'Royal',        elements: null },
  { id: 'Drinks3', image: 'Drinks3', label: 'Mountain dew', elements: null },
  { id: 'Drinks4', image: 'Drinks4', label: 'Sprite',       elements: null },
]

const ALL_TRAYS = [
  { id: 'Tray1', image: 'Tray1', label: 'Birdcage Cake Stands',                                        elements: null },
  { id: 'Tray2', image: 'Tray2', label: 'Bamboo Dessert Display Stands',                               elements: null },
  { id: 'Tray3', image: 'Tray3', label: 'Iron and Wood Food Risers or Catering Display Shelves',       elements: null },
  { id: 'Tray4', image: 'Tray4', label: 'Tree Bark Cake Stand or Natural Log Dessert Tower',           elements: null },
  { id: 'Tray5', image: 'Tray5', label: '3-Tier Wrought Iron and Wood Dessert Stand',                  elements: null },
  { id: 'Tray6', image: 'Tray6', label: 'Spiral Flower Pot Holder or Scrollwork Garden Display Rack',  elements: null },
  { id: 'Tray7', image: 'Tray7', label: 'Bicycle Plant Stand',                                         elements: null },
]

const PACKAGE_FILTERS = {
  '100 PAX|Package A (100 PAX)': {
    tents:   ['tent5', 'tent6', 'tent7', 'tent8'],
    tables:  ['table2', 'table4', 'table5', 'table6', 'table9'],
    boffies: ['boffie3', 'boffie5', 'boffie6', 'boffie7', 'boffie8'],
  },
  '50 PAX|Package A (50 PAX)': {
    tents:   ['tent5', 'tent6', 'tent8'],
    tables:  ['table4', 'table5', 'table8', 'table9'],
    boffies: ['boffie3', 'boffie5', 'boffie8'],
    tentMax: 2, foodMin: 4, drinksMin: 2,
  },
  '150 PAX|Package A (150 PAX)': {
    tents:   ['tent1', 'tent5', 'tent4', 'tent7', 'tent6'],
    tables:  ['table1', 'table3', 'table4', 'table5', 'table7'],
    boffies: ['boffie1', 'boffie2', 'boffie4', 'boffie5', 'boffie7'],
  },
  '150 PAX|Package C (150 PAX)': {
    tents:   ['tent1', 'tent2', 'tent3', 'tent4', 'tent6',, 'tent8'],
    tables:  ['table1', 'table3', , 'table5', 'table6', 'table7', 'table8'],
    boffies: ['boffie1', 'boffie2', 'boffie3', 'boffie5' , 'boffie7', 'boffie8'],
  },
  '200 PAX|Package A (200 PAX)': {
    tents:   ['tent1', 'tent2', 'tent3', 'tent4', 'tent5', 'tent6', 'tent7'],
    tables:  ['table1', 'table2', , 'table3', 'table4', 'table5', 'table6', 'table7', 'table8'],
    boffies: ['boffie1', 'boffie2', 'boffie3', 'boffie4' , 'boffie5', 'boffie6', 'boffie7', 'boffie8'],
  },
  '250 PAX|Package A (250 PAX)': {
    tents:   ['tent1', 'tent2', 'tent3', 'tent4', 'tent5', 'tent6', 'tent7'],
    tables:  ['table1', 'table2', , 'table3', 'table4', 'table5', 'table6', 'table7', 'table8'],
    boffies: ['boffie1', 'boffie2', 'boffie3', 'boffie4' , 'boffie5', 'boffie6', 'boffie7', 'boffie8'],
  },
  '300 PAX|Package A (300 PAX)': {
    tents:   ['tent1', 'tent2', 'tent3', 'tent4', 'tent5', 'tent6', 'tent7'],
    tables:  ['table1', 'table2', , 'table3', 'table4', 'table5', 'table6', 'table7', 'table8'],
    boffies: ['boffie1', 'boffie2', 'boffie3', 'boffie4' , 'boffie5', 'boffie6', 'boffie7', 'boffie8'],
  },
  '350 PAX|Package A (350 PAX)': {
    tents:   ['tent1', 'tent2', 'tent3', 'tent4', 'tent5', 'tent6', 'tent7'],
    tables:  ['table1', 'table2', , 'table3', 'table4', 'table5', 'table6', 'table7', 'table8'],
    boffies: ['boffie1', 'boffie2', 'boffie3', 'boffie4' , 'boffie5', 'boffie6', 'boffie7', 'boffie8'],
  },
  '400 PAX|Package A (400 PAX)': {
    tents:   ['tent1', 'tent2', 'tent3', 'tent4', 'tent5', 'tent6', 'tent7'],
    tables:  ['table1', 'table2', , 'table3', 'table4', 'table5', 'table6', 'table7', 'table8'],
    boffies: ['boffie1', 'boffie2', 'boffie3', 'boffie4' , 'boffie5', 'boffie6', 'boffie7', 'boffie8'],
  },
}

function getFiltered(all, allowedIds) {
  if (!allowedIds) return all
  return all.filter(item => allowedIds.includes(item.id))
}

function toggleInArray(arr, id, max) {
  if (arr.includes(id)) return arr.filter(x => x !== id)
  if (max && arr.length >= max) return arr
  return [...arr, id]
}

/* ─── Sub-components ─────────────────────────────────────── */
function SectionLabel({ children }) {
  return <p className="es-section-label">{children}</p>
}

function TentCard({ item, active, onClick, onExpand, badgeNumber, isMulti }) {
  return (
    <div className={`es-image-card${active ? ' active' : ''}`} onClick={onClick} role="button" aria-pressed={active}>
      <div className="es-image-wrapper">
        <img src={assets[item.image]} alt={item.label} className="es-card-image" />
        <button className="es-expand-btn" onClick={(e) => { e.stopPropagation(); onExpand() }} aria-label={`Expand ${item.label}`}>⤢</button>
        {active && <div className="es-selected-badge">{isMulti && badgeNumber != null ? `✓ #${badgeNumber}` : '✓ Selected'}</div>}
      </div>
      <p className="es-card-label">{item.label}</p>
    </div>
  )
}

function DetailCard({ item, active, onClick, onExpand }) {
  return (
    <div className={`es-image-card${active ? ' active' : ''}`} onClick={onClick} role="button" aria-pressed={active}>
      <div className="es-image-wrapper">
        <img src={assets[item.image]} alt={item.label} className="es-card-image" />
        <button className="es-expand-btn" onClick={(e) => { e.stopPropagation(); onExpand() }} aria-label={`View details of ${item.label}`}>⤢</button>
        {active && <div className="es-selected-badge">✓ Selected</div>}
        {item.elements && <div className="es-has-details-badge">View details</div>}
      </div>
      <p className="es-card-label">{item.label}</p>
    </div>
  )
}

function DetailModal({ item, selectedId, onSelect, onClose }) {
  const isChafingDish = item.id?.startsWith('Chapingdish')
  return (
    <div className="es-preview-modal" onClick={onClose}>
      <div className="es-table-detail-card" onClick={(e) => e.stopPropagation()}>
        <button className="es-detail-close" onClick={onClose}>✕</button>
        <img src={assets[item.image]} alt={item.label} className="es-detail-image" />
        <div className="es-detail-body">
          <h2 className="es-detail-title">{item.label}</h2>
          {item.elements ? (
            <ul className="es-detail-list">
              {item.elements.style    && <li><span className="es-detail-key">{isChafingDish ? 'Shape' : 'Style'}</span><span className="es-detail-val">{item.elements.style}</span></li>}
              {item.elements.colors   && <li><span className="es-detail-key">Colors</span><span className="es-detail-val">{item.elements.colors}</span></li>}
              {item.elements.lighting && <li><span className="es-detail-key">Lighting</span><span className="es-detail-val">{item.elements.lighting}</span></li>}
              {item.elements.vibe     && <li><span className="es-detail-key">Vibe</span><span className="es-detail-val">{item.elements.vibe}</span></li>}
            </ul>
          ) : (
            <p className="es-detail-coming">Details coming soon.</p>
          )}
          <button
            className="es-btn-primary"
            style={{ marginTop: '1rem', width: '100%' }}
            onClick={() => { onSelect(selectedId === item.id ? null : item.id); onClose() }}
          >
            {selectedId === item.id ? '✕ Deselect' : 'Select this setup'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Catering Selectable Item Card ──────────────────────── */
function CateringItemCard({ item, quantity, onToggle, onExpand }) {
  const selected = quantity > 0
  return (
    <div
      className={`es-catering-item-card${selected ? ' active' : ''}`}
      onClick={() => onToggle(item._id)}
      role="button"
      aria-pressed={selected}
      style={{ cursor: 'pointer' }}
    >
      {/* IMAGE */}
      <div className="es-catering-item-img-wrapper">
        <img
          src={`${BACKEND_URL}/images/${item.image}`}
          alt={item.name}
          className="es-catering-item-img"
          onClick={(e) => { e.stopPropagation(); onExpand(item) }}
          style={{ cursor: 'zoom-in' }}
        />
        {selected && (
          <div className="es-selected-badge">
            ✓{quantity > 1 ? ` ×${quantity}` : ' Selected'}
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="es-catering-item-info">
        <p className="es-catering-item-name">{item.name}</p>
        <p className="es-catering-item-cat">{item.category}</p>
        <p className="es-catering-item-price">₱{item.price.toLocaleString()}</p>
      </div>
    </div>
  )
}

/* ─── Catering Item Detail Modal ─────────────────────────── */
function CateringItemModal({ item, quantity, onToggle, onClose }) {
  const selected    = quantity > 0
  const hasElements = item.style || item.colors || item.vibe || item.lighting

  return (
    <div className="es-preview-modal" onClick={onClose}>
      <div className="es-table-detail-card" onClick={(e) => e.stopPropagation()}>
        <button className="es-detail-close" onClick={onClose}>✕</button>

        <img
          src={`${BACKEND_URL}/images/${item.image}`}
          alt={item.name}
          className="es-detail-image"
        />

        <div className="es-detail-body">
          <p className="es-catering-item-cat" style={{ marginBottom: 4 }}>{item.category}</p>
          <h2 className="es-detail-title">{item.name}</h2>

          <p style={{ fontSize: 14, color: '#555', marginBottom: '0.75rem', lineHeight: 1.6 }}>
            {item.description}
          </p>

          <p style={{ fontSize: 18, fontWeight: 700, color: '#534ab7', marginBottom: '1rem' }}>
            ₱{item.price.toLocaleString()}
            {quantity > 1 && (
              <span style={{ fontSize: 13, fontWeight: 400, color: '#888', marginLeft: 8 }}>
                ×{quantity} pcs
              </span>
            )}
          </p>

          {hasElements && (
            <ul className="es-detail-list" style={{ marginBottom: '1rem' }}>
              {item.style    && <li><span className="es-detail-key">Style</span><span className="es-detail-val">{item.style}</span></li>}
              {item.colors   && <li><span className="es-detail-key">Colors</span><span className="es-detail-val">{item.colors}</span></li>}
              {item.vibe     && <li><span className="es-detail-key">Vibe</span><span className="es-detail-val">{item.vibe}</span></li>}
              {item.lighting && <li><span className="es-detail-key">Lighting</span><span className="es-detail-val">{item.lighting}</span></li>}
            </ul>
          )}

          <button
            className="es-btn-primary"
            style={{ marginTop: '0.5rem', width: '100%' }}
            onClick={() => { onToggle(item._id); onClose() }}
          >
            {selected ? '✕ Deselect' : '+ Select this item'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Customize Design Panel ─────────────────────────────── */
const CATEGORY_ORDER = [
  "Motif",
  "Chafing Dish",
  "Buffet Skirting",
  "Extra Tent",
  "Extra Foods",
  "Extra Dessert",
  "Extra Drinks",
  "Dessert Tray",
]

function CustomizeDesignPanel({
  cateringItems,
  cateringQty,
  onToggle,
  addOnsLoading,
  addOnsCount,
  addOnsTotal,
  onExpandItem,
}) {
  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = cateringItems.filter(item => item.category === cat)
    if (items.length > 0) acc[cat] = items
    return acc
  }, {})

  const otherItems = cateringItems.filter(item => !CATEGORY_ORDER.includes(item.category))
  if (otherItems.length > 0) grouped['Other'] = otherItems

  return (
    <div className="es-customize-panel">
      {addOnsLoading ? (
        <p style={{ color: '#888', padding: '0.5rem 0 1rem' }}>Loading items...</p>
      ) : cateringItems.length === 0 ? (
        <p style={{ color: '#aaa', padding: '0.5rem 0 1rem' }}>No add-on items available yet.</p>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="es-catering-category-group">
            <div className="es-catering-category-header">
              <span className="es-catering-category-title">{category}</span>
              <span className="es-catering-category-count">
                {items.length} item{items.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="es-catering-items-grid">
              {items.map(item => (
                <CateringItemCard
                  key={item._id}
                  item={item}
                  quantity={cateringQty[item._id] || 0}
                  onToggle={onToggle}
                  onExpand={onExpandItem}
                />
              ))}
            </div>
          </div>
        ))
      )}

      {addOnsCount > 0 && (
        <div className="es-addons-summary">
          <span>Add-ons total:</span>
          <strong>₱{addOnsTotal.toLocaleString()}</strong>
        </div>
      )}
    </div>
  )
}

/* ─── sessionStorage helpers ─────────────────────────────── */
function loadSaved(key, fallback = null) {
  try { return JSON.parse(sessionStorage.getItem(key)) ?? fallback } catch { return fallback }
}
function persist(key, value) {
  try { sessionStorage.setItem(key, JSON.stringify(value)) } catch {}
}

/* ─── Page ───────────────────────────────────────────────── */
const EventSetup = () => {
  const navigate = useNavigate()
  const { state } = useLocation()

  const {
    eventType,
    selectedItems,
    location: eventLocation,
    selectedCategory,
    pax,
    packageLabel: incomingPackageLabel,
    packagePrice,
  } = state || {}

  const [tent,         setTentRaw]      = useState(() => loadSaved('es_tent'))
  const [table,        setTableRaw]     = useState(() => loadSaved('es_table'))
  const [boffie,       setBoffieRaw]    = useState(() => loadSaved('es_boffie'))
  const [colorPalette, setColorRaw]     = useState(() => loadSaved('es_color'))
  const [previewImage, setPreviewImage] = useState(null)
  const [tableDetail,  setTableDetail]  = useState(null)
  const [boffieDetail, setBoffieDetail] = useState(null)
  const [cateringDetail, setCateringDetail] = useState(null)

  const [showCustomize,      setShowCustomize]      = useState(false)
  const [hasOpenedCustomize, setHasOpenedCustomize] = useState(false)

  const [customTent,     setCustomTentRaw]  = useState(() => loadSaved('es_customTent'))
  const [skirting,       setSkirtingRaw]    = useState(() => loadSaved('es_skirting'))
  const [chapingDish,    setChapingDishRaw] = useState(() => loadSaved('es_chapingDish'))
  const [motif,          setMotifRaw]       = useState(() => loadSaved('es_motif'))
  const [dessert,        setDessertRaw]     = useState(() => loadSaved('es_dessert'))
  const [tray,           setTrayRaw]        = useState(() => loadSaved('es_tray'))

  const [tents50, setTents50Raw] = useState(() => loadSaved('es_tents50', []))
  const [foods,   setFoodsRaw]   = useState(() => loadSaved('es_foods',   []))
  const [drinks,  setDrinksRaw]  = useState(() => loadSaved('es_drinks',  []))

  const [cateringItems,  setCateringItems]  = useState([])
  const [cateringQty,    setCateringQty]    = useState({})
  const [addOnsLoading,  setAddOnsLoading]  = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res  = await fetch(`${BACKEND_URL}/api/cateringitem/list`)
        const data = await res.json()
        if (data.success) setCateringItems(data.data)
      } catch (err) {
        console.error("Failed to fetch catering items:", err)
      } finally {
        setAddOnsLoading(false)
      }
    }
    fetchItems()
  }, [])

  const packageId = selectedItems?.[0] ?? ''
  const filterKey = `${selectedCategory}|${packageId}`
  const filters   = PACKAGE_FILTERS[filterKey] ?? null
  const is50Pax   = filterKey === '50 PAX|Package A (50 PAX)'
  const tentMax   = filters?.tentMax   ?? null
  const foodMin   = filters?.foodMin   ?? 0
  const drinksMin = filters?.drinksMin ?? 0

  // ── Extract PAX number from selectedCategory (e.g. "50 PAX" → 50) ──
  const paxNumber = parseInt(selectedCategory) || 0

  // ── handleToggle: click to select/deselect a catering item.
  //    For Extra Dessert and Extra Drinks: auto-set qty to paxNumber on first select.
  const handleToggle = (id) => {
    const item    = cateringItems.find(i => i._id === id)
    const isAuto  = item?.category === 'Extra Dessert' || item?.category === 'Extra Drinks'
    const current = cateringQty[id] || 0

    setCateringQty(prev => {
      if (current > 0) {
        // Already selected → deselect (set to 0)
        return { ...prev, [id]: 0 }
      } else {
        // Not selected → select
        return { ...prev, [id]: isAuto && paxNumber > 0 ? paxNumber : 1 }
      }
    })
  }

  const selectedAddOns = cateringItems.filter(item => (cateringQty[item._id] || 0) > 0)
  const addOnsTotal    = selectedAddOns.reduce((sum, item) => sum + item.price * cateringQty[item._id], 0)
  const addOnsCount    = selectedAddOns.length

  const setTent         = v => { setTentRaw(v);        persist('es_tent', v) }
  const setTable        = v => { setTableRaw(v);       persist('es_table', v) }
  const setBoffie       = v => { setBoffieRaw(v);      persist('es_boffie', v) }
  const setColorPalette = v => { setColorRaw(v);       persist('es_color', v) }
  const setCustomTent   = v => { setCustomTentRaw(v);  persist('es_customTent', v) }
  const setSkirting     = v => { setSkirtingRaw(v);    persist('es_skirting', v) }
  const setChapingDish  = v => { setChapingDishRaw(v); persist('es_chapingDish', v) }
  const setMotif        = v => { setMotifRaw(v);       persist('es_motif', v) }
  const setDessert      = v => { setDessertRaw(v);     persist('es_dessert', v) }
  const setTray         = v => { setTrayRaw(v);        persist('es_tray', v) }
  const setTents50      = v => { setTents50Raw(v);     persist('es_tents50', v) }
  const setFoods  = updater => setFoodsRaw(prev  => { const next = typeof updater === 'function' ? updater(prev)  : updater; persist('es_foods',  next); return next })
  const setDrinks = updater => setDrinksRaw(prev => { const next = typeof updater === 'function' ? updater(prev)  : updater; persist('es_drinks', next); return next })

  const filteredTents   = useMemo(() => getFiltered(ALL_TENTS,   filters?.tents),   [filterKey])
  const filteredTables  = useMemo(() => getFiltered(ALL_TABLES,  filters?.tables),  [filterKey])
  const filteredBoffies = useMemo(() => getFiltered(ALL_BOFFIES, filters?.boffies), [filterKey])

  const [validationMsg, setValidationMsg] = useState('')

  if (!eventType) {
    return (
      <div className="es-empty">
        <h2>No event selected</h2>
        <button className="es-btn-primary" onClick={() => navigate('/booking')}>Go back</button>
      </div>
    )
  }

  const handleConfirm = () => {
    if (!hasOpenedCustomize) {
      if (is50Pax) {
        if (tents50.length === 0) {
          setValidationMsg('Please select at least 1 tent (max 2) before proceeding.')
          return
        }
      } else {
        if (!tent) {
          setValidationMsg('Please select a tent / structure before proceeding.')
          return
        }
      }

      if (!table) {
        setValidationMsg('Please select a table setup before proceeding.')
        return
      }

      if (!boffie) {
        setValidationMsg('Please select a buffet setup before proceeding.')
        return
      }
    }

    if (is50Pax) {
      if (foods.length < foodMin) {
        setValidationMsg(`Please select at least ${foodMin} food items (currently ${foods.length}).`)
        return
      }
      if (drinks.length < drinksMin) {
        setValidationMsg(`Please select at least ${drinksMin} drinks (currently ${drinks.length}).`)
        return
      }
    }

    setValidationMsg('')

    const setupDetails = {
      ...(is50Pax
        ? tents50.length > 0 && { tent: tents50.map(id => ALL_TENTS.find(t => t.id === id)?.label).join(', ') }
        : tent && { tent: ALL_TENTS.find(t => t.id === tent)?.label }),
      ...(table        && { table:       ALL_TABLES.find(t        => t.id === table)?.label }),
      ...(boffie       && { boffie:      ALL_BOFFIES.find(b       => b.id === boffie)?.label }),
      ...(colorPalette && { colorPalette:COLOR_PALETTES.find(c    => c.id === colorPalette)?.label }),
      ...(customTent   && { customTent:  ALL_TENTS.find(t         => t.id === customTent)?.label }),
      ...(skirting     && { skirting:    ALL_SKIRTINGS.find(s     => s.id === skirting)?.label }),
      ...(chapingDish  && { chapingDish: ALL_CHAPINGDISHES.find(c => c.id === chapingDish)?.label }),
      ...(motif        && { motif:       ALL_MOTIFS.find(m         => m.id === motif)?.label }),
      ...(foods.length > 0  && { food:   foods.map(id  => ALL_FOODS.find(f  => f.id === id)?.label).join(', ') }),
      ...(dessert           && { dessert: ALL_DESSERTS.find(d     => d.id === dessert)?.label }),
      ...(drinks.length > 0 && { drinks: drinks.map(id => ALL_DRINKS.find(d => d.id === id)?.label).join(', ') }),
      ...(tray              && { tray:   ALL_TRAYS.find(t         => t.id === tray)?.label }),
    }

    const addOnItems = selectedAddOns.map(item => ({
      name:     item.name,
      price:    item.price,
      quantity: cateringQty[item._id],
      category: item.category,
    }))

    navigate('/cateringbooking/process', {
      state: {
        eventType,
        selectedItems,
        location:     eventLocation,
        selectedCategory,
        setupDetails,
        pax,
        packageLabel: incomingPackageLabel,
        packagePrice,
        addOnItems,
        addOnsTotal,
      }
    })
  }

  const customizeCount = addOnsCount
  const packageLabel   = selectedItems?.[0] ?? 'Selected package'

  return (
    <div className="es-page">

      <div className="es-header">
        <p className="es-subtitle">Step 2 · {selectedCategory} · {packageLabel}</p>
        <h1 className="es-title">Customize your event setup</h1>
        <div className="es-confirmed-pill">✓ Package confirmed</div>
      </div>

      {/* ── Tent / Structure ── */}
      <SectionLabel>
        Tent / structure
        {is50Pax && (
          <span style={{ marginLeft: 8, fontSize: '0.78rem', fontWeight: 600, color: tents50.length > 0 ? '#2e7d32' : '#b71c1c' }}>
            (select up to {tentMax} — {tents50.length}/{tentMax} chosen)
          </span>
        )}
      </SectionLabel>
      <div className="es-image-grid">
        {filteredTents.map(t => {
          if (is50Pax) {
            const idx    = tents50.indexOf(t.id)
            const active = idx !== -1
            return (
              <TentCard key={t.id} item={t} active={active} isMulti badgeNumber={active ? idx + 1 : null}
                onClick={() => setTents50(toggleInArray(tents50, t.id, tentMax))}
                onExpand={() => setPreviewImage(assets[t.image])} />
            )
          }
          return (
            <TentCard key={t.id} item={t} active={tent === t.id} isMulti={false}
              onClick={() => setTent(tent === t.id ? null : t.id)}
              onExpand={() => setPreviewImage(assets[t.image])} />
          )
        })}
      </div>

      {/* ── Table Setup ── */}
      <SectionLabel>Table setup</SectionLabel>
      <div className="es-image-grid">
        {filteredTables.map(t => (
          <DetailCard key={t.id} item={t} active={table === t.id}
            onClick={() => setTable(table === t.id ? null : t.id)}
            onExpand={() => setTableDetail(t)} />
        ))}
      </div>

      {/* ── Buffet Setup ── */}
      <SectionLabel>Buffet setup</SectionLabel>
      <div className="es-image-grid">
        {filteredBoffies.map(b => (
          <DetailCard key={b.id} item={b} active={boffie === b.id}
            onClick={() => setBoffie(boffie === b.id ? null : b.id)}
            onExpand={() => setBoffieDetail(b)} />
        ))}
      </div>

      {/* ── Customize Design & Foods ── */}
      <div className="es-customize-section" style={{ marginTop: '2rem' }}>
        <button
          className="es-customize-toggle"
          onClick={() => {
            setShowCustomize(prev => !prev)
            setHasOpenedCustomize(true)
          }}
          aria-expanded={showCustomize}
        >
          <span className="es-customize-toggle-icon">{showCustomize ? '▲' : '▼'}</span>
          <span>Customize your Design &amp; Foods</span>
          {customizeCount > 0 && (
            <span className="es-customize-badge">
              {customizeCount} selected{addOnsTotal > 0 ? ` · +₱${addOnsTotal.toLocaleString()}` : ''}
            </span>
          )}
        </button>

        {showCustomize && (
          <CustomizeDesignPanel
            cateringItems={cateringItems}
            cateringQty={cateringQty}
            onToggle={handleToggle}
            addOnsLoading={addOnsLoading}
            addOnsCount={addOnsCount}
            addOnsTotal={addOnsTotal}
            onExpandItem={setCateringDetail}
          />
        )}
      </div>

      {/* ── Footer ── */}
      <div className="es-footer">
        {validationMsg && (
          <p style={{ color: '#b71c1c', fontWeight: 600, fontSize: '0.88rem', marginBottom: 8, textAlign: 'center' }}>
            ⚠️ {validationMsg}
          </p>
        )}
        <button className="es-btn-secondary" onClick={() => navigate(-1)}>Back</button>
        <button className="es-btn-primary"   onClick={handleConfirm}>Confirm Setup</button>
      </div>

      {/* ── Image preview modal (tents) ── */}
      {previewImage && (
        <div className="es-preview-modal" onClick={() => setPreviewImage(null)}>
          <button className="es-close-preview" onClick={() => setPreviewImage(null)}>✕</button>
          <img src={previewImage} alt="Preview" className="es-preview-image" />
        </div>
      )}

      {/* ── Table detail modal ── */}
      {tableDetail && (
        <DetailModal item={tableDetail} selectedId={table} onSelect={setTable} onClose={() => setTableDetail(null)} />
      )}

      {/* ── Buffet detail modal ── */}
      {boffieDetail && (
        <DetailModal item={boffieDetail} selectedId={boffie} onSelect={setBoffie} onClose={() => setBoffieDetail(null)} />
      )}

      {/* ── Catering item detail modal ── */}
      {cateringDetail && (
        <CateringItemModal
          item={cateringDetail}
          quantity={cateringQty[cateringDetail._id] || 0}
          onToggle={handleToggle}
          onClose={() => setCateringDetail(null)}
        />
      )}

    </div>
  )
}

export default EventSetup