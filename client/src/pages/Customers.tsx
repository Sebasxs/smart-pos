import { useState, useRef } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { PageHeader } from '../components/layout/PageHeader';
import { CustomerList } from '../components/customers/CustomerList';
import { CustomerModal } from '../components/customers/CustomerModal';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { SearchInput } from '../components/ui/SearchInput';
import { Button } from '../components/ui/Button';
import { HiOutlineArrowPath, HiOutlinePlus } from 'react-icons/hi2';
import { cn } from '../utils/cn';
import { useSearchShortcut } from '../hooks/useSearchShortcut';
import { type Customer } from '../types/customer';

export const Customers = () => {
   const { customers, isLoading, search, setSearch, deleteCustomer, refresh } = useCustomers();
   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
   const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
   const [customerModalOpen, setCustomerModalOpen] = useState(false);
   const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
   const inputRef = useRef<HTMLInputElement>(null);

   useSearchShortcut(inputRef);

   return (
      <div className="flex flex-col h-[100dvh] md:h-full overflow-hidden relative">
         <PageHeader
            title="Clientes"
            search={
               <SearchInput
                  ref={inputRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onClear={() => setSearch('')}
                  placeholder="Buscar por nombre, NIT o email..."
                  shortcutLabel="ESPACIO"
                  className="focus:border-brand-suppliers-solid/50 hover:border-brand-suppliers-solid/50 focus:bg-brand-suppliers-bg/10"
                  iconClassName="group-focus-within:text-brand-suppliers-solid"
               />
            }
            actions={
               <>
                  <Button
                     variant="secondary"
                     size="icon"
                     onClick={() => refresh()}
                     title="Actualizar lista"
                     className="hidden sm:flex"
                  >
                     <HiOutlineArrowPath className={cn(isLoading && 'animate-spin')} size={18} />
                  </Button>
                  <Button
                     variant="primary"
                     onClick={() => {
                        setCustomerToEdit(null);
                        setCustomerModalOpen(true);
                     }}
                     className="px-4 bg-brand-suppliers-solid hover:bg-brand-suppliers-solid-hover text-white shadow-brand-suppliers-solid/20"
                  >
                     <HiOutlinePlus size={18} />
                     <span className="hidden sm:inline">Nuevo Cliente</span>
                  </Button>
               </>
            }
         />

         <main className="flex-1 min-h-0 p-4 md:p-6 flex flex-col gap-4 max-w-[1600px] mx-auto w-full">
            <div className="flex-1 min-h-0 bg-surface/30 rounded-xl overflow-hidden shadow-sm relative backdrop-blur-sm">
               <CustomerList
                  customers={customers}
                  isLoading={isLoading}
                  onEdit={c => {
                     setCustomerToEdit(c);
                     setCustomerModalOpen(true);
                  }}
                  onDelete={c => {
                     setCustomerToDelete(c);
                     setDeleteModalOpen(true);
                  }}
               />
            </div>
         </main>

         {/* Modals */}
         <CustomerModal
            isOpen={customerModalOpen}
            onClose={() => setCustomerModalOpen(false)}
            customerToEdit={customerToEdit}
         />
         <ConfirmModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={async () => {
               if (customerToDelete) {
                  await deleteCustomer(customerToDelete.id);
                  setCustomerToDelete(null);
               }
            }}
            title="¿Eliminar cliente?"
            message={`Estás a punto de eliminar a "${customerToDelete?.name}".`}
         />
      </div>
   );
};
