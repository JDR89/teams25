

import { menuCards } from "./menu-cards";
import Cards from "./Cards";

const GridCards = () => {
  return (
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
       {
        menuCards.map((card) => (
          <Cards key={card.name} card={card} />
        ))
       }
      </div>
  )
}

export default GridCards
