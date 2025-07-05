import type { Report } from '../types/report'

const API_URL = 'http://localhost:3000/reports'

export async function getReports(): Promise<Report[]> {
  const res = await fetch(API_URL)
  return await res.json()
}

export async function createReport(data: Report): Promise<void> {
  const item: Report = {
    ...data,
    createAt: new Date(),
  };
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  })
}

export async function updateReport(id: number | string, data: Report): Promise<void> {
  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteReport(id: number | string): Promise<void> {
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })
}
