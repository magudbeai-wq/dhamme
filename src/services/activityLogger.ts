import type { AuditActivityLog, ActivityActionType } from '../types';
import { supabase } from './supabaseClient';

const STORAGE_KEY = 'dhamme_activity_logs_v1';
const BACKUP_KEY = 'dhamme_audit_logs_backup';

/**
 * Loads cached activity logs from local storage.
 */
export function getLocalActivityLogs(): AuditActivityLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(BACKUP_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load local activity logs:', err);
  }
  return [];
}

/**
 * Saves activity logs into both primary and backup storage keys.
 */
export function saveLocalActivityLogs(logs: AuditActivityLog[]) {
  try {
    const json = JSON.stringify(logs);
    localStorage.setItem(STORAGE_KEY, json);
    localStorage.setItem(BACKUP_KEY, json);
  } catch (err) {
    console.error('Failed to save local activity logs:', err);
  }
}

/**
 * Records an activity into Supabase cloud table `activity_logs` and local storage.
 */
export async function logActivity(entry: {
  action: ActivityActionType;
  entityType: 'property' | 'user' | 'inquiry' | 'system';
  entityId?: string;
  entityTitle?: string;
  actorEmail: string;
  actorName: string;
  details: string;
  metadata?: Record<string, any>;
}): Promise<AuditActivityLog> {
  const newLog: AuditActivityLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry
  };

  // 1. Save to Local Storage immediately
  const existing = getLocalActivityLogs();
  const updated = [newLog, ...existing.slice(0, 499)]; // Keep up to 500 recent logs
  saveLocalActivityLogs(updated);

  // 2. Persist to Supabase Database
  try {
    await supabase.from('activity_logs').insert([
      {
        id: newLog.id,
        action: newLog.action,
        entity_type: newLog.entityType,
        entity_id: newLog.entityId,
        entity_title: newLog.entityTitle,
        actor_email: newLog.actorEmail,
        actor_name: newLog.actorName,
        details: newLog.details,
        metadata: newLog.metadata,
        created_at: newLog.timestamp
      }
    ]);
  } catch (err) {
    console.warn('Failed to sync activity log to Supabase:', err);
  }

  return newLog;
}

/**
 * Fetches all activity logs from Supabase cloud database, merging with local logs.
 */
export async function fetchAllActivityLogs(): Promise<AuditActivityLog[]> {
  const localLogs = getLocalActivityLogs();

  try {
    const { data, error } = await supabase.from('activity_logs').select('*');
    if (data && !error && Array.isArray(data) && data.length > 0) {
      const dbLogs: AuditActivityLog[] = data.map((d: any) => ({
        id: d.id || `log-${Date.now()}`,
        action: d.action || 'DATABASE_SYNC',
        entityType: d.entity_type || 'system',
        entityId: d.entity_id,
        entityTitle: d.entity_title,
        actorEmail: d.actor_email || 'system@dhamme.app',
        actorName: d.actor_name || 'System',
        details: d.details || '',
        timestamp: d.created_at || new Date().toISOString(),
        metadata: d.metadata
      }));

      // Merge and remove duplicates
      const mergedMap = new Map<string, AuditActivityLog>();
      [...localLogs, ...dbLogs].forEach((item) => {
        if (item && item.id) {
          mergedMap.set(item.id, item);
        }
      });

      const merged = Array.from(mergedMap.values()).sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      saveLocalActivityLogs(merged);
      return merged;
    }
  } catch (err) {
    console.warn('Supabase activity logs fetch error:', err);
  }

  return localLogs;
}

/**
 * Triggers a full JSON database backup download to prevent any data loss.
 */
export function downloadFullDatabaseBackup(data: {
  properties: any[];
  users: any[];
  activityLogs: any[];
}) {
  const backupObject = {
    appName: 'DHAMME Real Estate Marketplace',
    backupVersion: '2.0-secure',
    exportedAt: new Date().toISOString(),
    totalProperties: data.properties.length,
    totalUsers: data.users.length,
    totalLogs: data.activityLogs.length,
    ...data
  };

  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupObject, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `dhamme-database-backup-${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
