import React from 'react';
import { Textarea, TagsMenu } from '@components';

export const MemoizedTextarea = React.memo(Textarea);
export const MemoizedTagsMenu = React.memo(TagsMenu);
