import { requireRole } from '@/lib/core/server';
import React from 'react';

const SeekerDashboardLayout = async({children}:{children:React.ReactNode}) => {
    
    await requireRole('seeker')
    
    return children
};

export default SeekerDashboardLayout;