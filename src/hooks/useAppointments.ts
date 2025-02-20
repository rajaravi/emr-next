import { useState, useEffect } from 'react';
import { getAppointmentsByPatientId, Appointment } from '@/services/appointmentService';

const useAppointments = (patientId: number) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [searchFilter, setSearchFilter] = useState<{ field: string; text: string } | undefined>(undefined);

  const fetchAppointmentList = async (page: number, sFilter?: { field: string; text: string }) => {
    if (!patientId) return;
    setLoading(true);
    try {

      const { appointments, total } = await getAppointmentsByPatientId(patientId, page, 10, sFilter);
      setAppointments(appointments);
      setTotal(total);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointmentList(page, searchFilter);
  }, [patientId, page, searchFilter]);

  return { appointments, total, loading, setPage, setSearchFilter };
};

export default useAppointments;
