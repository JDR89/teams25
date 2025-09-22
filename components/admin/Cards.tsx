import Link from 'next/link'
import React from 'react'
import { LucideIcon } from 'lucide-react'

interface Card {
    name: string;
    url: string;
    icon: LucideIcon;
    bgColor: string;
    hoverBgColor: string;
    iconColor: string;
    borderHoverColor: string;
}

const Cards = ({card}: {card: Card}) => {
    const IconComponent = card.icon;
    
    return (
        <Link href={card.url}>
            <div className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 ${card.borderHoverColor} group h-48 flex flex-col items-center justify-center`}>
                <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center ${card.hoverBgColor} transition-colors mb-4`}>
                    <IconComponent className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center">{card.name}</h3>
            </div>
        </Link>
    )
}

export default Cards
