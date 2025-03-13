import { useState } from 'react';

interface Element {
  id: number;
  type: 'text' | 'image' | 'grid';
  x: number;
  y: number;
  text?: string;
  src?: string;
  rows?: number;
  columns?: number;
}

export default function InvoiceDesigner() {
  const [elements, setElements] = useState<Element[]>([]);
  const [draggingElement, setDraggingElement] = useState<number | null>(null);

  const addElement = (type: 'text' | 'image' | 'grid') => {
    if (type === 'image') {
      setElements([...elements, { id: Date.now(), type, x: 50, y: 50, src: '' }]);
    } else if (type === 'grid') {
      setElements([...elements, { id: Date.now(), type, x: 50, y: 50, rows: 3, columns: 3 }]);
    } else {
      setElements([...elements, { id: Date.now(), type, x: 50, y: 50, text: 'Text' }]);
    }
  };

  const handleDragStart = (id: number) => {
    setDraggingElement(id);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (draggingElement !== null) {
      const rect = event.currentTarget.getBoundingClientRect();
      const updatedElements = elements.map((el) =>
        el.id === draggingElement ? { ...el, x: event.clientX - rect.left, y: event.clientY - rect.top } : el
      );
      setElements(updatedElements);
      setDraggingElement(null);
    }
  };

  return (
    <div className='mt-5 pt-5'>
      <button onClick={() => addElement('text')}>Add Text</button>
      <button onClick={() => addElement('image')}>Add Logo</button>
      <button onClick={() => addElement('grid')}>Add Line Item Grid</button>
      <div 
        style={{ border: '1px solid black', width: '210mm', height: '297mm', position: 'relative', margin: 'auto', background: 'white' }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {elements.map((el) => (
          <div
            key={el.id}
            style={{ position: 'absolute', left: el.x, top: el.y, cursor: 'move' }}
            draggable
            onDragStart={() => handleDragStart(el.id)}
          >
            {el.type === 'text' && el.text}
            {el.type === 'image' && <input type="file" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                  const updatedElements = elements.map((ele) => 
                    ele.id === el.id ? { ...ele, src: ev.target?.result as string } : ele
                  );
                  setElements(updatedElements);
                };
                reader.readAsDataURL(file);
              }
            }} />}
            {el.type === 'grid' && (
              <table border={1}>
                <tbody>
                  {Array.from({ length: el.rows ?? 3 }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {Array.from({ length: el.columns ?? 3 }).map((_, colIndex) => (
                        <td key={colIndex} style={{ width: '50px', height: '30px' }}></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}