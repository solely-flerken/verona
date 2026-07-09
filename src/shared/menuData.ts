import type {MenuCategory} from './types'

export const menuData: MenuCategory[] = [
    {
        id: 'pizza',
        name: 'Pizza',
        sizes: ['Ø 26', 'Ø 32', 'Ø 40'],
        items: [
            {id: 'margherita', name: 'Margherita', description: 'Tomatensauce, Mozzarella, Basilikum', price: ['7,00 €', '8,50 €', '12,50 €']},
            {id: 'salami', name: 'Salami', description: 'Tomatensauce, Mozzarella, italienische Salami', price: ['8,00 €', '9,50 €', '13,50 €']},
            {id: 'diavolo', name: 'Diavolo', description: 'scharfe Salami, Peperoni, rote Zwiebeln', price: ['9,00 €', '10,50 €', '14,50 €']},
            {id: 'verona-speciale', name: 'Verona Speciale', description: 'Parmaschinken, Rucola, Parmesan, Kirschtomaten', price: ['11,00 €', '12,50 €', '16,50 €']},
            {id: 'funghi', name: 'Funghi', description: 'frische Champignons, Mozzarella', price: ['7,50 €', '9,00 €', '13,00 €']},
            {id: 'tonno', name: 'Tonno', description: 'Thunfisch, rote Zwiebeln, Oliven', price: ['8,50 €', '10,00 €', '14,00 €']},
            {id: 'quattro-formaggi', name: 'Quattro Formaggi', description: 'vier italienische Käsesorten', price: ['9,50 €', '11,00 €', '15,00 €']},
            {id: 'calzone', name: 'Calzone', description: 'gefüllt mit Schinken, Champignons, Mozzarella', price: '11,50 €'},
        ],
    },
    {
        id: 'pasta',
        name: 'Pasta',
        items: [
            {id: 'spaghetti-bolognese', name: 'Spaghetti Bolognese', description: 'hausgemachte Fleischsauce', price: '9,00 €'},
            {id: 'penne-arrabbiata', name: 'Penne Arrabbiata', description: 'Tomaten, Knoblauch, Peperoncino', price: '8,50 €'},
            {id: 'tagliatelle-salmone', name: 'Tagliatelle Salmone', description: 'Lachs in Sahnesauce', price: '11,50 €'},
            {id: 'lasagne-al-forno', name: 'Lasagne al Forno', description: 'überbacken mit Mozzarella', price: '10,50 €'},
            {id: 'penne-gorgonzola', name: 'Penne Gorgonzola', description: 'cremige Gorgonzolasauce', price: '9,50 €'},
        ],
    },
    {
        id: 'salate',
        name: 'Salate',
        items: [
            {id: 'insalata-mista', name: 'Insalata Mista', description: 'bunter Salat der Saison', price: '6,50 €'},
            {id: 'insalata-caprese', name: 'Insalata Caprese', description: 'Tomaten, Büffelmozzarella, Basilikum', price: '8,00 €'},
            {id: 'insalata-tonno', name: 'Insalata Tonno', description: 'mit Thunfisch, Ei und Oliven', price: '9,00 €'},
            {id: 'insalata-pollo', name: 'Insalata Pollo', description: 'gebratene Hähnchenstreifen, Parmesan', price: '9,50 €'},
        ],
    },
    {
        id: 'dessert',
        name: 'Dessert',
        items: [
            {id: 'tiramisu', name: 'Tiramisu', description: 'hausgemacht, nach Familienrezept', price: '5,50 €'},
            {id: 'panna-cotta', name: 'Panna Cotta', description: 'mit Waldbeeren', price: '5,00 €'},
            {id: 'gelato-misto', name: 'Gelato Misto', description: 'drei Kugeln Eis nach Wahl', price: '4,50 €'},
        ],
    },
]
