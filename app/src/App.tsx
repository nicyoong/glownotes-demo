import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { Editor } from './components/Editor';
import { ActionReview } from './components/ActionReview';
import { Note, Action, ViewType } from './types';
import { INITIAL_NOTES, INITIAL_ACTIONS } from './constants';
import { summarizeNote } from './geminiService';

