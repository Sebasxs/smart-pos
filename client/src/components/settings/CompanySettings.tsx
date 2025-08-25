import { useEffect, useState } from 'react';
import { useOrganizationStore } from '../../store/organizationStore';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../ui/Input';
import { CustomSelect } from '../ui/CustomSelect';
import { Button } from '../ui/Button';
import { HiOutlineBuildingOffice2, HiOutlinePrinter } from 'react-icons/hi2';

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

   // Verificamos rol estrictamente
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
      try {
         await updateSettings(formData);
         // Toast Success aquí
      } catch (error) {
         console.error(error);
         // Toast Error aquí
      } finally {
         setIsSaving(false);
      }
   };

   if (isLoading && !settings)
      return <div className="p-4 text-zinc-500 animate-pulse">Cargando información...</div>;

   return (
      <form
         onSubmit={handleSubmit}
         className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300"
      >
         <div className="flex justify-between items-start">
            <div>
               <h2 className="text-xl font-bold text-white mb-1">Datos de la Empresa</h2>
               <p className="text-zinc-400 text-sm">
                  Información legal que aparecerá en facturas y reportes.
               </p>
               {!isSuperAdmin && (
                  <span className="inline-block mt-2 px-2 py-1 bg-amber-500/10 text-amber-400 text-xs rounded border border-amber-500/20">
                     Solo lectura. Contacta al propietario para editar.
                  </span>
               )}
            </div>
            {isSuperAdmin && (
               <Button type="submit" isLoading={isSaving} disabled={isSaving}>
                  Guardar Cambios
               </Button>
            )}
         </div>

         <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-zinc-800">
               <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                  <HiOutlineBuildingOffice2 size={20} />
               </div>
               <h3 className="font-medium text-zinc-200">Información Fiscal</h3>
            </div>

            <fieldset
               disabled={!isSuperAdmin}
               className="grid md:grid-cols-2 gap-4 disabled:opacity-70"
            >
               <div className="md:col-span-2">
                  <Input
                     label="Razón Social / Nombre Comercial"
                     name="company_name"
                     value={formData.company_name}
                     onChange={handleChange}
                     required
                  />
               </div>
               <Input
                  label="NIT / Identificación"
                  name="tax_id"
                  value={formData.tax_id}
                  onChange={handleChange}
               />
               <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-400">Régimen Tributario</label>
                  <CustomSelect
                     value={formData.tax_regime}
                     onChange={val =>
                        isSuperAdmin && setFormData(prev => ({ ...prev, tax_regime: val }))
                     }
                     options={TAX_REGIMES}
                     color="indigo"
                  />
               </div>
            </fieldset>

            <fieldset
               disabled={!isSuperAdmin}
               className="grid md:grid-cols-2 gap-4 pt-2 disabled:opacity-70"
            >
               <Input
                  label="Dirección Física"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
               />
               <Input label="Ciudad" name="city" value={formData.city} onChange={handleChange} />
               <Input
                  label="Teléfono de Contacto"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
               />
               <Input
                  label="Correo Electrónico Público"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
               />
            </fieldset>
         </div>

         {/* SECCIÓN FOOTER / IMPRESIÓN */}
         <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2 pb-4 border-b border-zinc-800">
               <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <HiOutlinePrinter size={20} />
               </div>
               <h3 className="font-medium text-zinc-200">Configuración de Ticket</h3>
            </div>

            <fieldset disabled={!isSuperAdmin} className="space-y-2 disabled:opacity-70">
               <label className="block text-sm font-medium text-zinc-400 mb-1.5">
                  Mensaje al pie de Factura
               </label>
               <textarea
                  name="invoice_footer"
                  value={formData.invoice_footer}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-zinc-800/50 border border-zinc-800 text-zinc-200 placeholder:text-zinc-600 rounded-lg px-3 py-2.5 outline-none focus:border-blue-500/70 focus:bg-zinc-800 hover:border-zinc-700 transition-all text-sm resize-none"
                  placeholder={`Ej:\nGracias por su compra.\nNo se hacen devoluciones de dinero.\nHorario: Lunes a Sábado 8am - 6pm`}
               />
               <p className="text-xs text-zinc-500">
                  Puedes usar múltiples líneas. Esta información aparecerá al final de la tirilla de
                  impresión.
               </p>
            </fieldset>
         </div>
      </form>
   );
};
