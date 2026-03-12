import type { Load } from "../types/index";

export const LOADS: Load[] = [
  { id:1, route:"Colorado Springs, CO", dest:"Tampa, FL", price:4100, miles:1778, type:"Full Load", cargo:"Flatbed / Oversized", image:"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=700&q=80", tag:"Best Load of the Week" },
  { id:2, route:"Charleston, SC", dest:"Canfield, OH", price:1800, miles:708, type:"Full Load", cargo:"Flatbed / Steel", image:"https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=700&q=80", tag:"Best Load of the Week" },
  { id:3, route:"Clinton, IA", dest:"Fort Johnson South, LA", price:4296, miles:961, type:"Full Load", cargo:"Military Load", image:"https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=700&q=80", tag:"Military Load" },
  { id:4, route:"Madera, CA", dest:"Fort Collins, CO", price:5120, miles:1374, type:"Full Load", cargo:"Flatbed / Heavy Machinery", image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80", tag:"Best Load of the Week" },
  { id:5, route:"Connellsville, PA", dest:"Snyder, OK", price:3100, miles:1408, type:"Full Load", cargo:"Flatbed / Equipment", image:"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=700&q=80", tag:"Best Load of the Week" },
  { id:6, route:"Deer Park, WA", dest:"Jackson, WY", price:2100, miles:720, type:"Full Load", cargo:"Flatbed / Construction", image:"https://images.unsplash.com/photo-1590496793929-36417d3117de?w=700&q=80", tag:null },
  { id:7, route:"Salt Lake City, UT", dest:"Houston, TX", price:5500, miles:1477, type:"Partial", cargo:"Stepdeck / Partial", image:"https://images.unsplash.com/photo-1501700493788-fa1a4fc9fe62?w=700&q=80", tag:"Partial Load" },
  { id:8, route:"Fort Lupton, CO", dest:"Houston, TX", price:2800, miles:1050, type:"Full Load", cargo:"Flatbed / Pipes", image:"https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=700&q=80", tag:"Best Load of the Week" },
];

export const FILTERS = ["All Loads", "Full Load", "Partial", "Military Load"];
