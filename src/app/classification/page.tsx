'use client';

import Item from "./_components/classification_item";

export default function Home() {
    return (
        <div className="flex justify-center">
            <div className="max-w-200 flex justify-around">
                <Item image='test' description='test' color='skyblue'/>
                <Item image='test' description='test' color='skyblue'/>
                <Item image='test' description='test' color='skyblue'/>
            </div>
        </div>
    )
}