--
-- PostgreSQL database dump
--

\restrict LUkrfrhFM1JF7u6Ne6qEPxakRO4ho8aqihfpHwSWTSKfKLNpSu3bB0t0QZZTzgT

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-06-14 22:07:57

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 248 (class 1259 OID 17152)
-- Name: ai_warehouse_suggestions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_warehouse_suggestions (
    id integer NOT NULL,
    product_id integer,
    warehouse_id integer,
    prediction text,
    recommendation text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.ai_warehouse_suggestions OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 17151)
-- Name: ai_warehouse_suggestions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ai_warehouse_suggestions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ai_warehouse_suggestions_id_seq OWNER TO postgres;

--
-- TOC entry 5210 (class 0 OID 0)
-- Dependencies: 247
-- Name: ai_warehouse_suggestions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ai_warehouse_suggestions_id_seq OWNED BY public.ai_warehouse_suggestions.id;


--
-- TOC entry 244 (class 1259 OID 17130)
-- Name: alerts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alerts (
    id integer NOT NULL,
    alert_type character varying(255),
    message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.alerts OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 17129)
-- Name: alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.alerts_id_seq OWNER TO postgres;

--
-- TOC entry 5211 (class 0 OID 0)
-- Dependencies: 243
-- Name: alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.alerts_id_seq OWNED BY public.alerts.id;


--
-- TOC entry 224 (class 1259 OID 16969)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    category_name character varying(255) NOT NULL,
    description text,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16968)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 5212 (class 0 OID 0)
-- Dependencies: 223
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 228 (class 1259 OID 16992)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    product_name character varying(255) NOT NULL,
    sku character varying(255),
    description text,
    price numeric(38,2),
    quantity integer DEFAULT 0,
    image_url text,
    category_id integer,
    supplier_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16991)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 5213 (class 0 OID 0)
-- Dependencies: 227
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 238 (class 1259 OID 17085)
-- Name: purchase_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_order_items (
    id integer NOT NULL,
    purchase_order_id integer,
    product_id integer,
    quantity integer,
    unit_price numeric(38,2),
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.purchase_order_items OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 17084)
-- Name: purchase_order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_order_items_id_seq OWNER TO postgres;

--
-- TOC entry 5214 (class 0 OID 0)
-- Dependencies: 237
-- Name: purchase_order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_order_items_id_seq OWNED BY public.purchase_order_items.id;


--
-- TOC entry 236 (class 1259 OID 17071)
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_orders (
    id integer NOT NULL,
    supplier_id integer,
    status character varying(255),
    total_amount numeric(38,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false,
    warehouse_id integer
);


ALTER TABLE public.purchase_orders OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 17070)
-- Name: purchase_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_orders_id_seq OWNER TO postgres;

--
-- TOC entry 5215 (class 0 OID 0)
-- Dependencies: 235
-- Name: purchase_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_orders_id_seq OWNED BY public.purchase_orders.id;


--
-- TOC entry 246 (class 1259 OID 17141)
-- Name: reports; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reports (
    id integer NOT NULL,
    report_name character varying(255),
    report_type character varying(100),
    generated_by character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.reports OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 17140)
-- Name: reports_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reports_id_seq OWNER TO postgres;

--
-- TOC entry 5216 (class 0 OID 0)
-- Dependencies: 245
-- Name: reports_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reports_id_seq OWNED BY public.reports.id;


--
-- TOC entry 220 (class 1259 OID 16937)
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    role_name character varying(255) NOT NULL,
    role_id bigint NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16936)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.roles_id_seq OWNER TO postgres;

--
-- TOC entry 5217 (class 0 OID 0)
-- Dependencies: 219
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- TOC entry 249 (class 1259 OID 17173)
-- Name: roles_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.roles ALTER COLUMN role_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.roles_role_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 242 (class 1259 OID 17112)
-- Name: sales_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_order_items (
    id integer NOT NULL,
    sales_order_id integer,
    product_id integer,
    quantity integer,
    unit_price numeric(38,2),
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.sales_order_items OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 17111)
-- Name: sales_order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sales_order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_order_items_id_seq OWNER TO postgres;

--
-- TOC entry 5218 (class 0 OID 0)
-- Dependencies: 241
-- Name: sales_order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sales_order_items_id_seq OWNED BY public.sales_order_items.id;


--
-- TOC entry 240 (class 1259 OID 17103)
-- Name: sales_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sales_orders (
    id integer NOT NULL,
    customer_name character varying(255),
    status character varying(255),
    total_amount numeric(38,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false,
    warehouse_id integer
);


ALTER TABLE public.sales_orders OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 17102)
-- Name: sales_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sales_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sales_orders_id_seq OWNER TO postgres;

--
-- TOC entry 5219 (class 0 OID 0)
-- Dependencies: 239
-- Name: sales_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sales_orders_id_seq OWNED BY public.sales_orders.id;


--
-- TOC entry 232 (class 1259 OID 17030)
-- Name: stock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock (
    id integer NOT NULL,
    product_id integer,
    warehouse_id integer,
    quantity integer DEFAULT 0,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.stock OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17029)
-- Name: stock_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_id_seq OWNER TO postgres;

--
-- TOC entry 5220 (class 0 OID 0)
-- Dependencies: 231
-- Name: stock_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_id_seq OWNED BY public.stock.id;


--
-- TOC entry 234 (class 1259 OID 17050)
-- Name: stock_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_movements (
    id integer NOT NULL,
    product_id integer,
    warehouse_id integer,
    movement_type character varying(255),
    quantity integer,
    movement_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    notes character varying(255),
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.stock_movements OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 17049)
-- Name: stock_movements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_movements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_movements_id_seq OWNER TO postgres;

--
-- TOC entry 5221 (class 0 OID 0)
-- Dependencies: 233
-- Name: stock_movements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_movements_id_seq OWNED BY public.stock_movements.id;


--
-- TOC entry 226 (class 1259 OID 16980)
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id integer NOT NULL,
    supplier_name character varying(255) NOT NULL,
    contact_person character varying(255),
    email character varying(255),
    phone character varying(255),
    address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16979)
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suppliers_id_seq OWNER TO postgres;

--
-- TOC entry 5222 (class 0 OID 0)
-- Dependencies: 225
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;


--
-- TOC entry 222 (class 1259 OID 16948)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(255),
    role_id bigint,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id bigint NOT NULL,
    is_active boolean,
    username character varying(255),
    is_deleted boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16947)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5223 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 250 (class 1259 OID 17183)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.users ALTER COLUMN user_id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 230 (class 1259 OID 17017)
-- Name: warehouses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouses (
    id integer NOT NULL,
    warehouse_name character varying(255) NOT NULL,
    location character varying(255),
    capacity integer,
    current_capacity integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_deleted boolean DEFAULT false,
    is_active boolean DEFAULT true
);


ALTER TABLE public.warehouses OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17016)
-- Name: warehouses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.warehouses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.warehouses_id_seq OWNER TO postgres;

--
-- TOC entry 5224 (class 0 OID 0)
-- Dependencies: 229
-- Name: warehouses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.warehouses_id_seq OWNED BY public.warehouses.id;


--
-- TOC entry 4969 (class 2604 OID 17155)
-- Name: ai_warehouse_suggestions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_warehouse_suggestions ALTER COLUMN id SET DEFAULT nextval('public.ai_warehouse_suggestions_id_seq'::regclass);


--
-- TOC entry 4963 (class 2604 OID 17133)
-- Name: alerts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts ALTER COLUMN id SET DEFAULT nextval('public.alerts_id_seq'::regclass);


--
-- TOC entry 4932 (class 2604 OID 16972)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 4937 (class 2604 OID 16995)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 4956 (class 2604 OID 17088)
-- Name: purchase_order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items ALTER COLUMN id SET DEFAULT nextval('public.purchase_order_items_id_seq'::regclass);


--
-- TOC entry 4953 (class 2604 OID 17074)
-- Name: purchase_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders ALTER COLUMN id SET DEFAULT nextval('public.purchase_orders_id_seq'::regclass);


--
-- TOC entry 4966 (class 2604 OID 17144)
-- Name: reports id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports ALTER COLUMN id SET DEFAULT nextval('public.reports_id_seq'::regclass);


--
-- TOC entry 4928 (class 2604 OID 16940)
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- TOC entry 4961 (class 2604 OID 17115)
-- Name: sales_order_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_order_items ALTER COLUMN id SET DEFAULT nextval('public.sales_order_items_id_seq'::regclass);


--
-- TOC entry 4958 (class 2604 OID 17106)
-- Name: sales_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_orders ALTER COLUMN id SET DEFAULT nextval('public.sales_orders_id_seq'::regclass);


--
-- TOC entry 4946 (class 2604 OID 17033)
-- Name: stock id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock ALTER COLUMN id SET DEFAULT nextval('public.stock_id_seq'::regclass);


--
-- TOC entry 4950 (class 2604 OID 17053)
-- Name: stock_movements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements ALTER COLUMN id SET DEFAULT nextval('public.stock_movements_id_seq'::regclass);


--
-- TOC entry 4934 (class 2604 OID 16983)
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- TOC entry 4929 (class 2604 OID 16951)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4941 (class 2604 OID 17020)
-- Name: warehouses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses ALTER COLUMN id SET DEFAULT nextval('public.warehouses_id_seq'::regclass);


--
-- TOC entry 5202 (class 0 OID 17152)
-- Dependencies: 248
-- Data for Name: ai_warehouse_suggestions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_warehouse_suggestions (id, product_id, warehouse_id, prediction, recommendation, created_at, is_deleted) FROM stdin;
\.


--
-- TOC entry 5198 (class 0 OID 17130)
-- Dependencies: 244
-- Data for Name: alerts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alerts (id, alert_type, message, created_at, is_deleted) FROM stdin;
\.


--
-- TOC entry 5178 (class 0 OID 16969)
-- Dependencies: 224
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, category_name, description, is_deleted) FROM stdin;
2	Mobiles	Android phones, iPhones, smartphones, and mobile devices.	f
3	Laptop Accessories	Laptop chargers, cooling pads, bags, keyboards, mouse, and USB hubs.	f
4	Laptop chargers, cooling pads, bags, keyboards, mouse, and USB hubs.	Phone covers, chargers, cables, power banks, earphones, and screen protectors.	f
1	Laptop	Gaming laptops, business laptops, ultrabooks, MacBooks, and workstation laptops.	t
5	Laptops	Gaming laptops, business laptops, ultrabooks, MacBooks, and workstation laptops.	f
6	Monitors	Computer monitors for office, gaming and professional use.	f
7	Networking	Routers, switches, access points and networking equipment.	f
8	Mobile Accessories	Collection of accessories for mobile devices including chargers, cables, power banks, phone cases, screen protectors, headphones, Bluetooth devices, adapters, and other smartphone-related products.	f
\.


--
-- TOC entry 5182 (class 0 OID 16992)
-- Dependencies: 228
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, product_name, sku, description, price, quantity, image_url, category_id, supplier_id, created_at, is_deleted) FROM stdin;
2	iPhone 15 Pro	MOB-IPHONE15-002	Apple smartphone with advanced camera and fast performance.\n	1650.00	0	https://images.unsplash.com/photo-1511707171634-5f897ff02aa9	2	3	2026-06-09 23:14:58.060404	t
3	Dell Latitude 5540	LAP-002	Business laptop with Intel Core i7 processor, 16GB RAM, 512GB SSD storage, 15.6-inch Full HD display, Wi-Fi 6, Bluetooth, and long battery life. Suitable for office work, business operations, and inventory management systems.	3200.00	0	https://images.unsplash.com/photo-1496181133206-80ce9b88a853	5	1	2026-06-11 13:30:36.363276	f
1	Dell XPS 15 Laptop	LAP-DELL-XPS-001	High-performance laptop for office work, programming, and design.\n	2500.00	0	https://images.unsplash.com/photo-1593642632823-8f785ba67e45	5	1	2026-06-09 22:59:45.13692	f
4	HP EliteBook 840	HP-840	Business laptop with high security features.\n	2800.00	0	https://images.unsplash.com/photo-1484788984921-03950022c9ef	5	6	2026-06-13 19:13:32.752456	f
5	Lenovo ThinkPad X1 Carbon	LEN-X1	Lightweight business ultrabook.\n	3100.00	0	https://images.unsplash.com/photo-1504707748692-419802cf939d	5	6	2026-06-13 19:14:17.02773	f
6	Apple MacBook Pro M4	MAC-M4	Professional Apple laptop for developers and designers.\n	4200.00	0	https://images.unsplash.com/photo-1515879218367-8466d910aaa4	5	3	2026-06-13 19:15:03.717056	f
7	Samsung Galaxy S25	SAM-S25	Flagship Android smartphone.	1200.00	0	https://images.unsplash.com/photo-1511707171634-5f897ff02aa9	2	2	2026-06-13 19:16:05.866036	f
8	Samsung Galaxy A56	SAM-A56	Mid-range Android smartphone.\n\n\n\n\n	550.00	0	https://images.unsplash.com/photo-1598327105666-5b89351aff97	2	2	2026-06-13 19:17:00.814219	f
9	iPhone 16 Pro	IPH-16PRO	Apple flagship smartphone.	1600.00	0	https://images.unsplash.com/photo-1512499617640-c74ae3a79d37	2	3	2026-06-13 19:17:55.702623	f
10	Xiaomi 15 Ultra	XM-15U	High-performance Android smartphone.	950.00	0	https://images.unsplash.com/photo-1580910051074-3eb694886505	2	2	2026-06-13 19:18:42.726958	f
11	Logitech MX Master 3S	LOG-MX3	Premium wireless productivity mouse.	120.00	0	https://images.unsplash.com/photo-1527864550417-7fd91fc51a46	4	5	2026-06-13 19:19:34.555582	f
12	Logitech K380	LOG-K380	Bluetooth multi-device keyboard.	90.00	0	https://images.unsplash.com/photo-1511467687858-23d96c32e4ae	4	5	2026-06-13 19:21:02.933521	f
13	Dell USB-C Dock	DELL-DOCK	Universal docking station.	180.00	0	https://images.unsplash.com/photo-1587829741301-dc798b83add3	3	1	2026-06-13 19:21:59.750921	f
14	Laptop Cooling Pad	COOL-PAD	Cooling pad with RGB fans.\n	40.00	0	https://images.unsplash.com/photo-1517694712202-14dd9538aa97	4	5	2026-06-13 19:23:12.460286	f
15	Samsung Power Bank 10000mAh	SAM-PB10	Fast charging power bank.\n	45.00	0	https://images.unsplash.com/photo-1609592806596-b43f4c3fdd79	8	2	2026-06-13 19:25:57.675444	f
17	Dell UltraSharp 27	MON-DELL27	27 inch professional monitor.	450.00	0	https://images.unsplash.com/photo-1527443224154-c4a3942d3acf	6	1	2026-06-13 19:27:58.457872	f
18	Samsung Odyssey G5	MON-G5	Gaming monitor 165Hz.	390.00	0	https://images.unsplash.com/photo-1545239351-1141bd82e8a6	6	2	2026-06-13 19:28:44.156104	f
19	Cisco Router AX3000	CISCO-AX3000	WiFi 6 Router.	400.00	0	https://images.unsplash.com/photo-1593642632823-8f785ba67e45	7	7	2026-06-13 19:29:45.61959	f
20	Cisco 24-Port Switch	CISCO-SW24	Managed Gigabit Ethernet switch.	650.00	0	https://images.unsplash.com/photo-1558494949-ef010cbdcc31	7	7	2026-06-13 19:30:28.169423	f
16	Type-C Cable	TYPE-C	1 meter USB-C cable.\n	8.00	0	https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800	4	5	2026-06-13 19:27:23.435773	f
\.


--
-- TOC entry 5192 (class 0 OID 17085)
-- Dependencies: 238
-- Data for Name: purchase_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order_items (id, purchase_order_id, product_id, quantity, unit_price, is_deleted) FROM stdin;
3	1	3	10	3200.00	f
4	1	1	8	2500.00	f
5	2	9	15	1600.00	f
6	2	6	8	4200.00	f
7	3	7	25	1200.00	f
8	3	8	35	550.00	f
9	4	11	100	120.00	f
10	4	12	50	90.00	f
11	5	19	14	400.00	f
12	5	20	22	650.00	f
13	6	4	25	2800.00	f
14	7	16	200	8.00	f
15	7	14	150	40.00	f
16	8	6	4	4200.00	f
\.


--
-- TOC entry 5190 (class 0 OID 17071)
-- Dependencies: 236
-- Data for Name: purchase_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_orders (id, supplier_id, status, total_amount, created_at, is_deleted, warehouse_id) FROM stdin;
1	1	RECEIVED	52000.00	2026-06-13 22:57:23.843476	f	4
3	2	PENDING	49250.00	2026-06-13 23:14:15.088661	f	1
4	5	PENDING	16500.00	2026-06-13 23:15:03.021614	f	3
2	3	CANCELLED	57600.00	2026-06-13 23:03:32.977883	f	2
6	6	PENDING	70000.00	2026-06-13 23:25:25.250197	f	4
7	5	PENDING	7600.00	2026-06-13 23:26:33.865726	f	3
5	7	RECEIVED	19900.00	2026-06-13 23:23:56.4312	f	1
8	3	RECEIVED	16800.00	2026-06-14 21:41:30.545566	f	2
\.


--
-- TOC entry 5200 (class 0 OID 17141)
-- Dependencies: 246
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reports (id, report_name, report_type, generated_by, created_at, is_deleted) FROM stdin;
\.


--
-- TOC entry 5174 (class 0 OID 16937)
-- Dependencies: 220
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, role_name, role_id) FROM stdin;
1	ADMIN	1
2	INVENTORY_MANAGER	2
3	PURCHASING_MANAGER	3
4	EMPLOYEE	4
\.


--
-- TOC entry 5196 (class 0 OID 17112)
-- Dependencies: 242
-- Data for Name: sales_order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_order_items (id, sales_order_id, product_id, quantity, unit_price, is_deleted) FROM stdin;
1	1	7	5	1200.00	f
2	2	4	1	2800.00	f
3	2	1	2	2500.00	f
4	3	9	2	1600.00	f
5	4	14	4	40.00	f
6	4	19	4	400.00	f
7	5	16	1	8.00	f
8	6	1	2	2500.00	f
9	7	20	2	650.00	f
\.


--
-- TOC entry 5194 (class 0 OID 17103)
-- Dependencies: 240
-- Data for Name: sales_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales_orders (id, customer_name, status, total_amount, created_at, is_deleted, warehouse_id) FROM stdin;
1	Aseel Abd Elhaq	COMPLETED	6000.00	2026-06-14 00:12:49.305961	f	2
3	Majed Hasan 	PENDING	3200.00	2026-06-14 00:15:36.350548	f	2
4	Zaina Abed 	PENDING	1760.00	2026-06-14 00:19:26.52398	f	1
5	Yasmeen Majed	PENDING	8.00	2026-06-14 00:19:51.288935	f	3
7	Dima Saed 	PENDING	1300.00	2026-06-14 00:20:55.882203	f	5
2	Deema Abu Nimeh 	CANCELLED	7800.00	2026-06-14 00:14:44.640143	f	4
6	Lana Omar 	CANCELLED	5000.00	2026-06-14 00:20:19.261694	f	4
\.


--
-- TOC entry 5186 (class 0 OID 17030)
-- Dependencies: 232
-- Data for Name: stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock (id, product_id, warehouse_id, quantity, updated_at, is_deleted) FROM stdin;
1	1	1	3	2026-06-13 20:09:59.322309	f
2	11	1	2	2026-06-13 20:15:49.95198	f
4	15	3	1	2026-06-13 20:17:06.711604	f
5	16	3	5	2026-06-13 20:17:26.300904	f
7	4	4	35	2026-06-13 20:18:06.696561	f
8	5	4	20	2026-06-13 20:18:45.588389	f
10	9	2	25	2026-06-13 20:19:24.706904	f
11	10	2	40	2026-06-13 20:19:47.307096	f
12	17	1	15	2026-06-13 20:20:15.268269	f
13	18	1	12	2026-06-13 20:20:54.312911	f
14	19	5	25	2026-06-13 20:21:17.381377	f
15	20	5	18	2026-06-13 20:21:44.351545	f
16	12	1	30	2026-06-13 20:22:16.239226	f
17	13	1	22	2026-06-13 20:22:45.265154	f
18	14	1	45	2026-06-13 20:23:26.601909	f
3	15	3	5	2026-06-13 20:51:02.260481	f
19	3	5	4	2026-06-13 21:41:54.412706	f
6	3	4	56	2026-06-13 22:59:02.656234	f
20	1	4	8	2026-06-13 22:59:02.670509	f
21	19	1	14	2026-06-13 23:26:46.780482	f
22	20	1	22	2026-06-13 23:26:46.792018	f
9	7	2	55	2026-06-14 00:13:29.210538	f
23	6	2	4	2026-06-14 21:41:38.763193	f
\.


--
-- TOC entry 5188 (class 0 OID 17050)
-- Dependencies: 234
-- Data for Name: stock_movements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_movements (id, product_id, warehouse_id, movement_type, quantity, movement_date, notes, is_deleted) FROM stdin;
1	3	4	PURCHASE_RECEIVE	10	2026-06-13 22:59:02.648164	Received from purchase order #1	f
2	1	4	PURCHASE_RECEIVE	8	2026-06-13 22:59:02.672136	Received from purchase order #1	f
3	19	1	PURCHASE_RECEIVE	14	2026-06-13 23:26:46.780482	Received from purchase order #5	f
4	20	1	PURCHASE_RECEIVE	22	2026-06-13 23:26:46.79356	Received from purchase order #5	f
5	6	2	PURCHASE_RECEIVE	4	2026-06-14 21:41:38.779507	Received from purchase order #8	f
\.


--
-- TOC entry 5180 (class 0 OID 16980)
-- Dependencies: 226
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suppliers (id, supplier_name, contact_person, email, phone, address, created_at, is_deleted) FROM stdin;
1	Dell Technologies	Ahmad Ali	dell@suppliers.com	0599123456	Ramallah Industrial Area	2026-06-09 18:07:32.7197	f
3	Apple Distribution	Yousef Naser	apple@distribution.com	0599567890	Nablus Technology Center	2026-06-09 18:11:25.581381	f
2	Samsung Electronics	Mohammad Khaled	samsung@supplier.com	0599345600	Jerusalem Main Street	2026-06-09 18:08:10.966911	f
4	Lenovo Middle East	Omar Hasan	lenovo@supplier.com	0599789012	Hebron Commercial Zone	2026-06-09 18:16:55.598764	t
5	Logitech Palestine	Ali Saleh	logitech@supplier.com	 0599111222	Ramallah 	2026-06-11 13:28:37.986026	f
6	HP Distribution	Omar Hassan	hp@distribution.com	0599456123	Nablus Technology Center	2026-06-13 19:04:58.776149	f
7	Cisco Systems	Yousef Naser	cisco@supplier.com	0599887766	Bethlehem	2026-06-13 19:05:57.507424	f
\.


--
-- TOC entry 5176 (class 0 OID 16948)
-- Dependencies: 222
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, full_name, email, password, phone, role_id, created_at, user_id, is_active, username, is_deleted) FROM stdin;
5	Aseel	employee2@gmail.com	1234	0598347004	4	\N	5	t	Aseel.employee	f
2	Inventory Manager	inventory1@gmail.com	1234	0599000002	2	2026-06-06 21:21:09.49779	2	t	layan.inventory	f
3	Purchasing Manager	purchasing1@gmail.com	1234	0599000003	3	2026-06-06 21:21:09.49779	3	t	omar.purchase	f
4	Warehouse Employee	employee1@gmail.com	1234	0599000004	4	2026-06-06 21:21:09.49779	4	t	yousef.warehouse	f
6	Diala Marwan 	Diyala@gmail.com	1234	0598346778	4	\N	6	t	dialay.emplyee	f
1	Admin User	admin1@gmail.com	1234@Aseel	0599000001	1	2026-06-06 21:21:09.49779	1	t	ahmad.admin	f
8	Yasmeen	aseelabdelhaq228@gmail.com	1234	0598369874	4	\N	8	t	yasmeen.employee	f
\.


--
-- TOC entry 5184 (class 0 OID 17017)
-- Dependencies: 230
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.warehouses (id, warehouse_name, location, capacity, current_capacity, created_at, is_deleted, is_active) FROM stdin;
6	Overflow Warehouse	Ramallah 	1000	950	2026-06-08 22:39:10.31039	f	t
7	zd	asd	500	499	2026-06-08 22:41:48.914571	f	f
3	Mobile Accessories Warehouse	Hebron Commercial District\n	1800	911	2026-06-08 22:37:29.682071	f	t
5	Smart Devices Storage	Jenin Warehouse Park\n	3000	1247	2026-06-08 22:38:42.073745	f	t
4	Laptop Distribution Center	Bethlehem Main Road\n	4200	3819	2026-06-08 22:38:01.388325	f	t
1	Main Warehouse	Ramallah Industrial Area\n	5000	3365	2026-06-08 22:33:07.451074	f	t
2	Electronics Storage	Nablus Tech Zone\n	2500	1524	2026-06-08 22:36:25.163116	f	t
\.


--
-- TOC entry 5225 (class 0 OID 0)
-- Dependencies: 247
-- Name: ai_warehouse_suggestions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ai_warehouse_suggestions_id_seq', 1, false);


--
-- TOC entry 5226 (class 0 OID 0)
-- Dependencies: 243
-- Name: alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.alerts_id_seq', 1, false);


--
-- TOC entry 5227 (class 0 OID 0)
-- Dependencies: 223
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 8, true);


--
-- TOC entry 5228 (class 0 OID 0)
-- Dependencies: 227
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 20, true);


--
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 237
-- Name: purchase_order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_order_items_id_seq', 16, true);


--
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 235
-- Name: purchase_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_orders_id_seq', 8, true);


--
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 245
-- Name: reports_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reports_id_seq', 1, false);


--
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 219
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 4, true);


--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 249
-- Name: roles_role_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_role_id_seq', 4, true);


--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 241
-- Name: sales_order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sales_order_items_id_seq', 9, true);


--
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 239
-- Name: sales_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sales_orders_id_seq', 7, true);


--
-- TOC entry 5236 (class 0 OID 0)
-- Dependencies: 231
-- Name: stock_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_id_seq', 23, true);


--
-- TOC entry 5237 (class 0 OID 0)
-- Dependencies: 233
-- Name: stock_movements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_movements_id_seq', 5, true);


--
-- TOC entry 5238 (class 0 OID 0)
-- Dependencies: 225
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 7, true);


--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 221
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 8, true);


--
-- TOC entry 5240 (class 0 OID 0)
-- Dependencies: 250
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 8, true);


--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 229
-- Name: warehouses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.warehouses_id_seq', 7, true);


--
-- TOC entry 5007 (class 2606 OID 17161)
-- Name: ai_warehouse_suggestions ai_warehouse_suggestions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_warehouse_suggestions
    ADD CONSTRAINT ai_warehouse_suggestions_pkey PRIMARY KEY (id);


--
-- TOC entry 5003 (class 2606 OID 17139)
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);


--
-- TOC entry 4981 (class 2606 OID 16978)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4985 (class 2606 OID 17003)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4987 (class 2606 OID 17219)
-- Name: products products_sku_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_key UNIQUE (sku);


--
-- TOC entry 4997 (class 2606 OID 17091)
-- Name: purchase_order_items purchase_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4995 (class 2606 OID 17078)
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- TOC entry 5005 (class 2606 OID 17150)
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- TOC entry 4973 (class 2606 OID 16944)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 4975 (class 2606 OID 17181)
-- Name: roles roles_role_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_role_name_key UNIQUE (role_name);


--
-- TOC entry 5001 (class 2606 OID 17118)
-- Name: sales_order_items sales_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_order_items
    ADD CONSTRAINT sales_order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4999 (class 2606 OID 17110)
-- Name: sales_orders sales_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT sales_orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4993 (class 2606 OID 17059)
-- Name: stock_movements stock_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_pkey PRIMARY KEY (id);


--
-- TOC entry 4991 (class 2606 OID 17038)
-- Name: stock stock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (id);


--
-- TOC entry 4983 (class 2606 OID 16990)
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- TOC entry 4977 (class 2606 OID 16962)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4979 (class 2606 OID 16960)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4989 (class 2606 OID 17028)
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (id);


--
-- TOC entry 5024 (class 2606 OID 17162)
-- Name: ai_warehouse_suggestions fk_ai_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_warehouse_suggestions
    ADD CONSTRAINT fk_ai_product FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 5025 (class 2606 OID 17167)
-- Name: ai_warehouse_suggestions fk_ai_warehouse; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_warehouse_suggestions
    ADD CONSTRAINT fk_ai_warehouse FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- TOC entry 5013 (class 2606 OID 17060)
-- Name: stock_movements fk_movement_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT fk_movement_product FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 5014 (class 2606 OID 17065)
-- Name: stock_movements fk_movement_warehouse; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT fk_movement_warehouse FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- TOC entry 5009 (class 2606 OID 17006)
-- Name: products fk_product_category; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- TOC entry 5010 (class 2606 OID 17011)
-- Name: products fk_product_supplier; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_product_supplier FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- TOC entry 5018 (class 2606 OID 17092)
-- Name: purchase_order_items fk_purchase_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT fk_purchase_order FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id);


--
-- TOC entry 5015 (class 2606 OID 17257)
-- Name: purchase_orders fk_purchase_order_warehouse; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT fk_purchase_order_warehouse FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- TOC entry 5019 (class 2606 OID 17097)
-- Name: purchase_order_items fk_purchase_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT fk_purchase_product FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 5016 (class 2606 OID 17079)
-- Name: purchase_orders fk_purchase_supplier; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT fk_purchase_supplier FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id);


--
-- TOC entry 5017 (class 2606 OID 17230)
-- Name: purchase_orders fk_purchase_warehouse; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT fk_purchase_warehouse FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- TOC entry 5022 (class 2606 OID 17119)
-- Name: sales_order_items fk_sales_order; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_order_items
    ADD CONSTRAINT fk_sales_order FOREIGN KEY (sales_order_id) REFERENCES public.sales_orders(id);


--
-- TOC entry 5020 (class 2606 OID 17262)
-- Name: sales_orders fk_sales_order_warehouse; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT fk_sales_order_warehouse FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- TOC entry 5023 (class 2606 OID 17124)
-- Name: sales_order_items fk_sales_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_order_items
    ADD CONSTRAINT fk_sales_product FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 5021 (class 2606 OID 17241)
-- Name: sales_orders fk_sales_warehouse; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sales_orders
    ADD CONSTRAINT fk_sales_warehouse FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- TOC entry 5011 (class 2606 OID 17039)
-- Name: stock fk_stock_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT fk_stock_product FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- TOC entry 5012 (class 2606 OID 17044)
-- Name: stock fk_stock_warehouse; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT fk_stock_warehouse FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id);


--
-- TOC entry 5008 (class 2606 OID 17192)
-- Name: users fk_user_role; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES public.roles(id);


-- Completed on 2026-06-14 22:07:58

--
-- PostgreSQL database dump complete
--

\unrestrict LUkrfrhFM1JF7u6Ne6qEPxakRO4ho8aqihfpHwSWTSKfKLNpSu3bB0t0QZZTzgT

