'use client';

import React from 'react';
import {useTranslation} from "react-i18next";
import PageHeader from '@/components/PageHeader';
import WIPSection from "@/components/WIPSection";

import '@/i18n';

const ForumPage = () => {
    const {t} = useTranslation(['forum', 'common']);

    return (
        <>
            <PageHeader title={`${t('title')}`}/>

            <WIPSection/>
        </>
    );
}

export default ForumPage;