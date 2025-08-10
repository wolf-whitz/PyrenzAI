import React, { useEffect, useState } from 'react';
import { useUserStore } from '~/store';
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Utils } from '~/Utility';
import { Sidebar, MobileNav, CharacterReport, InsertModelForm } from '@components';
import { PyrenzDialog } from '~/theme';

interface CharacterReportType {
  report_content: string;
  char_uuid: string;
  user_uuid: string;
  creator_uuid: string;
}

export function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<CharacterReportType[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [onDialogConfirm, setOnDialogConfirm] = useState<() => void>(() => {});
  const userUUID = useUserStore((state) => state.userUUID);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      const { data } = await Utils.db.select<{ is_admin: boolean }>({
        tables: 'admins',
        columns: 'is_admin',
        match: { user_uuid: userUUID },
      });
      setIsAdmin(data?.[0]?.is_admin || false);
      setLoading(false);
    };
    if (userUUID) checkAdminStatus();
  }, [userUUID]);

  useEffect(() => {
    const fetchAdminData = async () => {
      const data = await Utils.db.rpc<CharacterReportType[]>({
        func: 'get_admin_data',
        params: { admin_uuid: userUUID },
      });
      setReports(data || []);
    };
    if (isAdmin && userUUID) fetchAdminData();
  }, [isAdmin, userUUID]);

  const openBanDialog = (
    id: string,
    action: 'ban' | 'unban',
    target: 'character' | 'user'
  ) => {
    const confirmAction = async () => {
      try {
        const fnName =
          target === 'character' ? 'manage_character_ban' : 'manage_user_ban';
        const inputKey =
          target === 'character' ? 'target_char_uuid' : 'target_user_uuid';
        await Utils.db.rpc({
          func: fnName,
          params: {
            admin_uuid: userUUID,
            [inputKey]: id,
            ban_type: action,
          },
        });
        if (action === 'ban') {
          if (target === 'character') {
            setReports((prev) => prev.filter((r) => r.char_uuid !== id));
          }
          if (target === 'user') {
            setReports((prev) => prev.filter((r) => r.user_uuid !== id));
          }
        }
      } catch (e) {
        console.error(`Failed to ${action} ${target}:`, e);
      } finally {
        setDialogOpen(false);
      }
    };
    setDialogContent(
      `Are you sure you want to ${action} this ${target}? This action cannot be undone.`
    );
    setOnDialogConfirm(() => confirmAction);
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="52vh">
        <Typography variant="h6" color="textSecondary">
          Access Denied: Admins Only
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Box sx={{ display: { xs: 'none', md: 'block' }, p: 5, pr: 3 }}>
          <Sidebar />
        </Box>
        <Box sx={{ flex: 1, p: isMobile ? 2 : 4, mb: isMobile ? '56px' : 0 }}>
          <Typography variant="h4" gutterBottom textAlign="center">
            Admin Panel
          </Typography>

          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Character Reports
            </Typography>
            {reports.length === 0 ? (
              <Typography color="text.secondary">No reports found.</Typography>
            ) : (
              <CharacterReport
                reports={reports}
                onBanCharacter={(id) => openBanDialog(id, 'ban', 'character')}
                onUnbanCharacter={(id) => openBanDialog(id, 'unban', 'character')}
                onBanUser={(id) => openBanDialog(id, 'ban', 'user')}
                onUnbanUser={(id) => openBanDialog(id, 'unban', 'user')}
              />
            )}
          </Box>

          <InsertModelForm />
        </Box>
      </Box>
      {isMobile && <MobileNav setShowLoginModal={() => {}} />}
      <PyrenzDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Confirm Action"
        content={dialogContent}
        onConfirm={onDialogConfirm}
      />
    </Box>
  );
}
