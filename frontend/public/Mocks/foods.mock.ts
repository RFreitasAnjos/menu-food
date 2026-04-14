import type { FoodItem } from "@/app/types";

export function foodMock(): FoodItem[] {
   return [
      {
         id: "1",
         title: "Pizza",
         description: "Delicious cheese pizza with tomato sauce and toppings.",
         category: "pizza",
         value: 10.99,
         img: "https://example.com/pizza.jpg"
      },
      {
         id: "2",
         title: "Burger",
         description: "Juicy beef burger with lettuce, tomato, and cheese.",
         category: "burger",
         value: 8.99,
         img: "https://example.com/burger.jpg"
      },
      {
         id: "3",
         title: "Sushi",
         description: "Fresh sushi rolls with a variety of fillings.",
         category: "sushi",
         value: 12.99,
         img: "https://example.com/sushi.jpg"
      },
      {
         id: "4",
         title: "Pasta",
         description: "Classic Italian pasta with marinara sauce and parmesan.",
         category: "pasta",
         value: 9.99,
         img: "https://example.com/pasta.jpg"
      },
      {
         id: "5",
         title: "Salad",
         description: "Healthy green salad with mixed vegetables and vinaigrette.",
         category: "salad",
         value: 7.99,
         img: "https://example.com/salad.jpg"
      },
      {
         id: "6",
         title: "Refrigerante Coca-Cola",
         description: "Refrigerante gelado para acompanhar sua refeição.",
         category: "bebida",
         value: 2.99,
         img: "https://example.com/cocacola.jpg"
      },
      {
         id: "7",
         title: "Suco de Laranja Natural",
         description: "Suco fresco feito com laranjas selecionadas.",
         category: "bebida",
         value: 3.99,
         img: "https://example.com/suco-laranja.jpg"
      },
      {
         id: "8",
         title: "Água Mineral",
         description: "Água mineral gelada para hidratar sua refeição.",
         category: "bebida",
         value: 1.99,
         img: "https://example.com/agua-mineral.jpg"
      },
      {
         id: "9",
         title: "Cerveja Artesanal",
         description: "Cerveja artesanal gelada para acompanhar seu prato.",
         category: "bebida",
         value: 4.99,
         img: "https://example.com/cerveja-artesanal.jpg"
      },
      {
         id: "10",
         title: "Chá Gelado de Limão",
         description: "Chá gelado refrescante com sabor de limão.",
         category: "bebida",
         value: 3.49,
         img: "https://example.com/cha-gelado-limao.jpg"
      },
      {
         id: "11",
         title: "Café Expresso",
         description: "Café expresso forte para finalizar sua refeição com energia.",
         category: "bebida",
         value: 2.49,
         img: "https://example.com/cafe-expresso.jpg"
      },
      {
         id: "12",
         title: "Coxinha",
         description: "Salgadinho brasileiro recheado com frango desfiado e temperos.",
         category: "salgado",
         value: 4.99,
         img: "https://example.com/coxinha.jpg"
      },
      {
         id: "13",
         title: "Pastel de Queijo",
         description: "Pastel frito recheado com queijo derretido e saboroso.",
         category: "salgado",
         value: 3.99,
         img: "https://example.com/pastel-queijo.jpg"
      },
      {
         id: "14",
         title: "Pizza de Frango com Catupiry",
         description: "Pizza saborosa com frango desfiado e catupiry cremoso.",
         category: "pizza",
         value: 11.99,
         img: "https://example.com/pizza-frango-catupiry.jpg"
      },
      {
         id: "15",
         title: "Pizza de Calabresa",
         description: "Pizza apimentada com calabresa fatiada e queijo derretido.",
         category: "pizza",
         value: 10.99,
         img: "https://example.com/pizza-calabresa.jpg"
      },
      {
         id: "16",
         title: "Pizza de Margherita",
         description: "Pizza clássica com molho de tomate, mussarela e manjericão.",
         category: "pizza",
         value: 9.99,
         img: "https://example.com/pizza-margherita.jpg"
      }
   ]
}
