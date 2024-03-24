import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';

export default function SearchResultItemMoreMenu() {
  const resultItemMenuRef = useRef(null);
  return (
    <div>
      <Button
        type="button"
        icon="pi pi-ellipsis-v"
        className="p-button-rounded p-button-text p-button-plain"
        onClick={(event) => resultItemMenuRef.current.toggle(event)}
      />
      <Menu
        ref={resultItemMenuRef}
        popup
        model={[
          { label: 'View client', icon: 'pi pi-fw pi-user' },
          { label: 'View pet', icon: 'pi pi-fw pi-twitter' },
        ]}
      />
    </div>
  );
}
