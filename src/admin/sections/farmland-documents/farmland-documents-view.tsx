/* eslint-disable no-nested-ternary */

'use client';

import { Box, Stack, Typography } from '@mui/material';
import { ro } from 'date-fns/locale';
import Image from 'next/image';
import { useContext } from 'react';
import { AuthContext } from 'src/auth/context';
import { FarmlandDocuments } from 'src/types/farmlands';

interface Props {
  activeStep: number;
  documents: FarmlandDocuments[];
  onNext: (index: number) => void;
}

const getColor = (status: string, idx: number, activeStep: number, type: string, roleId: number, reviewStatus: string) => {

  if (activeStep === idx) {
    return type === 'bg' ? '#8280FF4D' : '#8280FF';
  }

  if ((roleId === 1 || roleId === 4 || roleId === 5 || roleId === 6) && reviewStatus?.toLowerCase() === 'pending') {
    return type === 'bg' ? '#FFFCF0' : '#FFD311';
  }

  if (status?.toLowerCase() === 'completed') {
    return type === 'bg' ? '#0CA00C21' : '#0CA00C';
  }

  if (status?.toLowerCase() === 'turnback') {
    return type === 'bg' ? '#FFEEEE' : '#FD5454';
  }

  return type === 'bg' ? '#fff' : '#3D3D3D';
};

function FarmlandDocumentsView({ activeStep, documents, onNext }: Props) {

  const { user } = useContext(AuthContext);

  const getDocumentDetails = async (status: string, index: number) => {
    if (status !== 'Pending') {
      onNext(index);
    }
  };

  const renderImages = (document: any) => {
    const { reviewStatus, documentStatus } = document;
    if (reviewStatus === 'Pending' && (user?.role_id === 1 || user?.role_id === 4 || user?.role_id === 5 || user?.role_id === 6)) {
      return (
        <Image
          src="/assets/images/warning.png"
          width={12}
          height={12}
          alt="check"
        />
      );
    }
    if (documentStatus === 'Completed') {
      return (
        <Image
          src="/assets/icons/field-officer/check-green.svg"
          width={12}
          height={12}
          alt="check"
        />
      );
    }
    if (documentStatus === 'Turnback') {
      return (
        <Image
          src="/assets/images/questionMark.png"
          width={12}
          height={12}
          alt="check"
        />
      );
    }

    return null;
  };

  return (
    <Stack
      direction="row"
      alignItems="center"
      bgcolor="white"
      px="20px"
      py="30px"
      borderRadius="10px"
      spacing="20px"
      flexWrap="wrap"
    >
      {documents.map((item, idx) => (
        <Stack
          key={idx}
          direction="row"
          alignItems="center"
          py="10px"
          pl="10px"
          pr="20px"
          borderRadius="999px"
          bgcolor={getColor(item.documentStatus, idx, activeStep, 'bg', user?.role_id, item.reviewStatus)}
          border={`1px solid ${getColor(item.documentStatus, idx, activeStep, 'border', user?.role_id, item.reviewStatus)}`}
          onClick={() => getDocumentDetails(item.documentStatus, idx)}
          sx={{ cursor: 'pointer' }}
        >
          <Stack
            width="18px"
            height="18px"
            alignItems="center"
            justifyContent="center"
            border={`1px solid ${getColor(item.documentStatus, idx, activeStep, 'border', user?.role_id, item.reviewStatus)}`}
            borderRadius="999px"
          >
            {idx === activeStep && item.documentStatus.toLowerCase() !== 'completed' &&
              item.documentStatus.toLowerCase() !== 'turnback' && (
                <Box width="12px" height="12px" borderRadius="999px" bgcolor="#8280FF" />
              )}

            {renderImages(item)}

          </Stack>
          <Typography ml="10px" color={getColor(item.documentStatus, idx, activeStep, 'text', user?.role_id, item.reviewStatus)}>
            {item.documentName}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default FarmlandDocumentsView;
