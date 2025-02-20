import ENDPOINTS from '@/utils/constants/endpoints';
import { execute_axios_post } from '@/utils/services/httpService';

export interface Appointment {
  id: string;
  patientId: number;
  date: string;
  doctor: string;
  status: string;
}

export const getAppointmentsByPatientId = async (
  patientId: number,
  page: number = 1,
  pageSize: number = 10,
  searchFilter?: { field: string; text: string }
): Promise<{ appointments: any[]; total: number }> => {
  try {
    const params: Record<string, string | number> = {
        patient_id: patientId,
        page,
        limit: pageSize,
    };

    if (searchFilter) {
      params[searchFilter.field] = searchFilter.text;
    }

    // let passData: string = JSON.stringify(params);
    const response = await execute_axios_post(ENDPOINTS.POST_APPOINTMENT_LIST, params);

    return {
      appointments: response.data.list,
      total: response.data.total,
    };
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return { appointments: [], total: 0 };
  }
};
