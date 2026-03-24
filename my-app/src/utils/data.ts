import type { Load } from "../types/index";

export const LOADS: Load[] = [
  // ── Реальные грузы Click Express Inc (Instagram) ───────────────────────
  { id:1, route:"Colorado Springs, CO", dest:"Tampa, FL",          price:4100,  miles:1778, type:"Full Load", cargo:"Flatbed / Oversized Containers",    image:"/images/real9.jpg", tag:"Best Load of the Week" },
  { id:2, route:"Madera, CA",           dest:"Fort Collins, CO",   price:5120,  miles:1374, type:"Full Load", cargo:"Flatbed / HVAC Units",               image:"/images/real2.jpg", tag:"Best Load of the Week" },
  { id:3, route:"Deer Park, WA",        dest:"Jackson, WY",        price:2100,  miles:720,  type:"Full Load", cargo:"Flatbed / Steel Beams",              image:"/images/real3.jpg", tag:"Best Load of the Week" },
  { id:4, route:"Salt Lake City, UT",   dest:"Houston, TX",        price:5500,  miles:1477, type:"Partial",   cargo:"Stepdeck / Heavy Machinery",         image:"/images/real4.jpg", tag:"Partial Load" },
  { id:5, route:"Key Largo, FL",        dest:"Lake Ozark, MO",     price:4000,  miles:1447, type:"Full Load", cargo:"Flatbed / Equipment",                image:"/images/real5.jpg", tag:"Best Load of the Week" },
  { id:6, route:"Anniston, AL",         dest:"Apache Junction, AZ",price:19499, miles:6800, type:"Full Load", cargo:"Military / Multi-Stop",              image:"/images/real6.jpg", tag:"Military Load" },
  { id:7, route:"Connellsville, PA",    dest:"Snyder, OK",         price:3100,  miles:1408, type:"Full Load", cargo:"Flatbed / Heavy Equipment",          image:"/images/real7.jpg", tag:"Best Load of the Week" },
  { id:8, route:"Las Vegas, NV",        dest:"Carnesville, GA",    price:6350,  miles:2047, type:"Partial",   cargo:"Flatbed / Construction Equipment",   image:"/images/real8.jpg", tag:"Best Load of the Week" },
  { id:9, route:"Houston, TX",          dest:"Jackson, WY",        price:14900, miles:4201, type:"Full Load", cargo:"Flatbed / Multi-Stop Steel",          image:"/images/real1.jpg", tag:"Best Load of the Week" },
];

export const FILTERS = ["All Loads", "Full Load", "Partial", "Military Load"];