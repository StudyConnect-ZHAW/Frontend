'use client';

import React from 'react';
import {useTranslation} from "react-i18next";
import PageHeader from '@/components/PageHeader';
import WIPSection from "@/components/WIPSection";

import '@/i18n';

const ChatPage = () => {
    const {t} = useTranslation(['chat', 'common']);

    return (
        <>
            <PageHeader title={`${t('chat:title')}`}/>

            <WIPSection/>
        </>
    );
}

export default ChatPage;