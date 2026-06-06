import type { Load } from "../types/index";

export const LOADS: Load[] = [
 // Реальные грузы Click Express Inc (Instagram) 
  { id:1, route:"Colorado Springs, CO", dest:"Tampa, FL",          price:4100,  miles:1778, type:"Full Load", cargo:"Flatbed / Oversized Containers",    image:"/images/real9.webp", tag:"Best Load of the Week" },
  { id:2, route:"Madera, CA",           dest:"Fort Collins, CO",   price:5120,  miles:1374, type:"Full Load", cargo:"Flatbed / HVAC Units",               image:"/images/real2.webp", tag:"Best Load of the Week" },
  { id:3, route:"Deer Park, WA",        dest:"Jackson, WY",        price:2100,  miles:720,  type:"Full Load", cargo:"Flatbed / Steel Beams",              image:"/images/real3.webp", tag:"Best Load of the Week" },
  { id:4, route:"Salt Lake City, UT",   dest:"Houston, TX",        price:5500,  miles:1477, type:"Partial",   cargo:"Stepdeck / Heavy Machinery",         image:"/images/real4.webp", tag:"Partial Load" },
  { id:5, route:"Key Largo, FL",        dest:"Lake Ozark, MO",     price:4000,  miles:1447, type:"Full Load", cargo:"Flatbed / Equipment",                image:"/images/real5.webp", tag:"Best Load of the Week" },
  { id:6, route:"Anniston, AL",         dest:"Apache Junction, AZ",price:19499, miles:6800, type:"Full Load", cargo:"Military / Multi-Stop",              image:"/images/real6.webp", tag:"Military Load" },
  { id:7, route:"Connellsville, PA",    dest:"Snyder, OK",         price:3100,  miles:1408, type:"Full Load", cargo:"Flatbed / Heavy Equipment",          image:"/images/real7.webp", tag:"Best Load of the Week" },
  { id:8, route:"Las Vegas, NV",        dest:"Carnesville, GA",    price:6350,  miles:2047, type:"Partial",   cargo:"Flatbed / Construction Equipment",   image:"/images/real8.webp", tag:"Best Load of the Week" },
  { id:9,  route:"Houston, TX",              dest:"Jackson, WY",            price:14900, miles:4201, type:"Full Load", cargo:"Flatbed / Multi-Stop Steel",        image:"/images/real1.webp", tag:"Best Load of the Week" },
  { id:10, route:"Phoenix, AZ",             dest:"Memphis, TN",            price:6800,  miles:1620, type:"Full Load", cargo:"Flatbed / Heavy Equipment",           image:"/images/real10.webp", tag:"Best Load of the Week" },
  { id:11, route:"Phoenix, AZ",             dest:"Miami, FL",              price:12500, miles:3082, type:"Partial",   cargo:"Stepdeck / Generator Equipment (via Santa Fe Springs, CA)", image:"/images/новая карточка 1.webp",  tag:"Best Load of the Week" },
  { id:12, route:"Stillwater, OK",          dest:"Miami, FL",              price:22400, miles:5200, type:"Full Load", cargo:"Flatbed / Multi-Stop (7 stops via CA, AZ)",                 image:"/images/новая карточка 2.webp",  tag:"Weekly Gross" },
];

export const FILTERS = ["All Loads", "Full Load", "Partial", "Military Load"];