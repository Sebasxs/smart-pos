import { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';
import { useOrganizationStore } from '../../store/organizationStore';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../ui/Input';
import { CustomSelect } from '../ui/CustomSelect';
import { Button } from '../ui/Button';
import { SectionHeader } from '../ui/SectionHeader';
import {
   HiOutlineBuildingOffice2,
   HiOutlinePrinter,
   HiOutlineCheck,
   HiOutlineExclamationCircle,
} from 'react-icons/hi2';

const TAX_REGIMES = [
   { value: 'not_responsible_iva', label: 'No Responsable de IVA (Simplificado)' },
   { value: 'responsible_iva', label: 'Responsable de IVA (Común)' },
   { value: 'simple_taxation_regime', label: 'Régimen Simple de Tributación' },
   { value: 'grand_contributor', label: 'Gran Contribuyente' },
   { value: 'special_regime', label: 'Régimen Especial (ESAL)' },
];

export const CompanySettings = () => {
   const { user } = useAuthStore();
   const { settings, fetchSettings, updateSettings, isLoading } = useOrganizationStore();

   const [isSaving, setIsSaving] = useState(false);
   const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
   const [formData, setFormData] = useState({
      company_name: '',
      tax_id: '',
      tax_regime: 'not_responsible_iva',
      address: '',
      phone: '',
      email: '',
      city: '',
      invoice_footer: '',
   });

   const isSuperAdmin = user?.role === 'super_admin';

   useEffect(() => {
      fetchSettings();
   }, []);

   useEffect(() => {
      if (settings) {
         setFormData({
            company_name: settings.company_name || '',
            tax_id: settings.tax_id || '',
            tax_regime: settings.tax_regime || 'not_responsible_iva',
            address: settings.address || '',
            phone: settings.phone || '',
            email: settings.email || '',
            city: settings.city || '',
            invoice_footer: settings.invoice_footer || '',
         });
      }
   }, [settings]);

   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isSuperAdmin) return;

      setIsSaving(true);
      setSaveStatus('idle');
      try {
         await updateSettings(formData);
         setSaveStatus('success');
         setTimeout(() => setSaveStatus('idle'), 3000);
      } catch (error) {
         console.error(error);
         setSaveStatus('error');
         setTimeout(() => setSaveStatus('idle'), 3000);
      } finally {
         setIsSaving(false);
      }
   };

   if (isLoading && !settings)
      return <div className="p-8 text-text-dim animate-pulse text-sm">Cargando información...</div>;

   return (
      <form
         onSubmit={handleSubmit}
         className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl"
      >
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
               <h2 className="text-lg font-bold text-text-main mb-1">Datos de la Empresa</h2>
               <p className="text-text-muted text-sm">
                  Información legal que aparecerá en facturas y reportes.
               </p>
               {!isSuperAdmin && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-warning-bg text-warning-text text-xs font-medium rounded-full border border-warning/20">
                     <HiOutlineExclamationCircle />
                     <span>Modo lectura. Contacta al propietario para editar.</span>
                  </div>
               )}
            </div>
            {isSuperAdmin && (
               <Button
                  type="submit"
                  isLoading={isSaving}
                  disabled={isSaving || saveStatus !== 'idle'}
                  className={cn(
                     'min-w-[150px] transition-all duration-300 shadow-lg',
                     saveStatus === 'success' &&
                        'bg-success hover:bg-success border-transparent disabled:opacity-100 text-white',
                     saveStatus === 'error' &&
                        'bg-danger hover:bg-danger border-transparent disabled:opacity-100 text-white',
                  )}
               >
                  {saveStatus === 'success' ? (
                     <div className="flex items-center gap-2">
                        <HiOutlineCheck size={18} />
                        <span>¡Guardado!</span>
                     </div>
                  ) : saveStatus === 'error' ? (
                     <div className="flex items-center gap-2">
                        <HiOutlineExclamationCircle size={18} />
                        <span>Error</span>
                     </div>
                  ) : (
                     'Guardar Cambios'
                  )}
               </Button>
            )}
         </div>

         <div className="bg-surface rounded-xl shadow-sm overflow-hidden">
            <SectionHeader
               title="Información Fiscal"
               icon={HiOutlineBuildingOffice2}
               iconClassName="text-info-text"
               iconContainerClassName="bg-info-bg border border-info/20"
            />

            <div className="p-6">
               <fieldset
                  disabled={!isSuperAdmin}
                  className="grid md:grid-cols-2 gap-x-6 gap-y-5 disabled:opacity-60"
               >
                  <div className="md:col-span-2">
                     <Input
                        label="Razón Social / Nombre Comercial"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        required
                        className="font-bold text-text-main"
                     />
                  </div>
                  <Input
                     label="NIT / Identificación"
                     name="tax_id"
                     value={formData.tax_id}
                     onChange={handleChange}
                     placeholder="Ej: 900.123.456-1"
                  />
                  <div className="space-y-1.5">
                     <label className="text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide ml-1">
                        Régimen Tributario
                     </label>
                     <CustomSelect
                        value={formData.tax_regime}
                        onChange={val =>
                           isSuperAdmin && setFormData(prev => ({ ...prev, tax_regime: val }))
                        }
                        options={TAX_REGIMES}
                        color="flat"
                     />
                  </div>
               </fieldset>

               <div className="mt-6 pt-6 border-t border-border/40">
                  <fieldset
                     disabled={!isSuperAdmin}
                     className="grid md:grid-cols-2 gap-x-6 gap-y-5 disabled:opacity-60"
                  >
                     <Input
                        label="Dirección Física"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                     />
                     <Input
                        label="Ciudad"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                     />
                     <Input
                        label="Teléfono de Contacto"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                     />
                     <Input
                        label="Email Público"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                     />
                  </fieldset>
               </div>
            </div>
         </div>

         <div className="bg-surface rounded-xl shadow-sm overflow-hidden">
            <SectionHeader
               title="Configuración de Ticket"
               icon={HiOutlinePrinter}
               iconClassName="text-primary-text"
               iconContainerClassName="bg-primary-subtle border border-primary/20"
            />

            <div className="p-6">
               <fieldset disabled={!isSuperAdmin} className="space-y-3 disabled:opacity-60">
                  <label className="block text-xs font-bold text-text-muted mb-1.5 uppercase tracking-wide ml-1">
                     Mensaje al pie de Factura
                  </label>
                  <div className="relative">
                     <textarea
                        name="invoice_footer"
                        value={formData.invoice_footer}
                        onChange={handleChange}
                        rows={4}
                        className="w-full bg-surface-highlight/40 border border-transparent hover:border-border-hover text-text-main placeholder:text-text-dim rounded-xl px-4 py-3 outline-none focus:border-border-focus focus:bg-surface-active/60 transition-all text-sm resize-none"
                        placeholder={`Ej:\nGracias por su compra.\nNo se hacen devoluciones de dinero.\nHorario: Lunes a Sábado 8am - 6pm`}
                     />
                     <div className="absolute right-3 bottom-3 text-[10px] text-text-dim font-medium bg-surface/50 px-2 py-1 rounded">
                        Visible en impresión
                     </div>
                  </div>
               </fieldset>
            </div>
         </div>
      </form>
   );
};
