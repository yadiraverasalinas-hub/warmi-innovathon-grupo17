export const recipes = [
  {
    id: 'lomo',
    name: 'Lomo saltado',
    category: 'Fondo',
    time: '35 min',
    servings: 4,
    difficulty: 'Media',
    image: `${import.meta.env.BASE_URL}images/lomo.jpg`,
    ingredients: ['500 g de lomo en tiras', '2 cebollas', '2 tomates', '1 ají amarillo', 'Sillao y vinagre', 'Papas fritas y arroz'],
    steps: ['Sella la carne a fuego muy fuerte.', 'Agrega cebolla, tomate y ají.', 'Añade sillao y vinagre.', 'Sirve con papas fritas y arroz.']
  },
  {
    id: 'aji',
    name: 'Ají de gallina',
    category: 'Fondo',
    time: '50 min',
    servings: 4,
    difficulty: 'Media',
    image: `${import.meta.env.BASE_URL}images/aji.jpg`,
    ingredients: ['1 pechuga de pollo cocida', '4 panes remojados en leche', '3 ajíes amarillos licuados', '1 cebolla', 'Nueces o maní', 'Papas sancochadas'],
    steps: ['Deshilacha el pollo.', 'Sofríe cebolla y ají.', 'Licúa el pan con la leche y agrégalo.', 'Mezcla con el pollo y sirve sobre papas.']
  },
  {
    id: 'arroz',
    name: 'Arroz con leche',
    category: 'Postres',
    time: '45 min',
    servings: 6,
    difficulty: 'Fácil',
    image: `${import.meta.env.BASE_URL}images/arroz.jpg`,
    ingredients: ['1 taza de arroz', '1 litro de leche', '1 lata de leche evaporada', '1 rama de canela', 'Azúcar al gusto'],
    steps: ['Cocina el arroz con la canela.', 'Agrega la leche poco a poco.', 'Endulza y cocina a fuego bajo.', 'Sirve tibio con canela en polvo.']
  },
  {
    id: 'causa',
    name: 'Causa limeña',
    category: 'Rápidas',
    time: '30 min',
    servings: 4,
    difficulty: 'Fácil',
    image: `${import.meta.env.BASE_URL}images/causa.jpg`,
    ingredients: ['1 kg de papa amarilla', 'Ají amarillo', 'Limón', 'Pollo o atún', 'Palta', 'Mayonesa'],
    steps: ['Prensa las papas y mézclalas con ají y limón.', 'Arma capas con relleno de pollo o atún.', 'Decora con palta.', 'Enfría antes de servir.']
  },
  {
    id: 'chaufa',
    name: 'Arroz chaufa',
    category: 'Rápidas',
    time: '30 min',
    servings: 4,
    difficulty: 'Fácil',
    image: `${import.meta.env.BASE_URL}images/chaufa.jpg`,
    ingredients: ['3 tazas de arroz cocido y frío', '250 g de pollo en cubos', '2 huevos', '3 tallos de cebolla china', '2 cucharadas de sillao', 'Aceite vegetal'],
    steps: ['Prepara una tortilla con los huevos y córtala en tiras.', 'Dora el pollo y cocínalo completamente.', 'Agrega el arroz y el sillao; saltea hasta que esté caliente.', 'Incorpora el huevo y la cebolla china, mezcla y sirve.']
  },
  {
    id: 'ceviche',
    name: 'Ceviche',
    category: 'Fondo',
    time: '30 min',
    servings: 4,
    difficulty: 'Fácil',
    image: `${import.meta.env.BASE_URL}images/ceviche.jpg`,
    ingredients: ['600 g de pescado fresco apto para preparación cruda', '10 limones', '1 cebolla roja', 'Ají limo al gusto', 'Culantro picado', 'Camote y choclo para acompañar'],
    steps: ['Mantén el pescado refrigerado hasta prepararlo y córtalo en cubos.', 'Mézclalo con sal, ají y el jugo de limón justo antes de servir.', 'Añade cebolla y culantro; mezcla suavemente.', 'Sirve de inmediato con camote y choclo. El limón no sustituye una cocción segura.']
  },
  {
    id: 'mazamorra-morada',
    name: 'Mazamorra morada',
    category: 'Postres',
    time: '60 min',
    servings: 6,
    difficulty: 'Media',
    image: `${import.meta.env.BASE_URL}images/mazamorra-morada.jpg`,
    ingredients: ['250 g de maíz morado', '1 rodaja de piña', '1 manzana', 'Canela y clavo de olor', 'Azúcar al gusto', '4 cucharadas de harina de camote', 'Fruta seca al gusto'],
    steps: ['Hierve el maíz morado con la piña, la manzana, canela y clavo; cuela el líquido.', 'Regresa el líquido a la olla, agrega azúcar y fruta seca y cocina unos minutos.', 'Disuelve la harina de camote en agua fría y agrégala poco a poco, mezclando.', 'Cocina hasta que espese y sirve con canela.']
  },
  {
    id: 'caldo-gallina',
    name: 'Caldo de gallina',
    category: 'Fondo',
    time: '90 min',
    servings: 4,
    difficulty: 'Media',
    image: `${import.meta.env.BASE_URL}images/caldo-gallina.jpg`,
    ingredients: ['4 presas de gallina', '250 g de fideos gruesos', '4 papas amarillas', '4 huevos', '1 rama de apio', '1 trozo de kion', 'Cebolla china al gusto', 'Sal y orégano'],
    steps: ['Cocina la gallina en agua con apio, kion y sal hasta que esté tierna.', 'Retira la espuma y agrega las papas; cocina hasta que empiecen a ablandarse.', 'Añade los fideos y cocina hasta que estén suaves.', 'Sirve cada plato con un huevo cocido, cebolla china y orégano.']
  }
];
