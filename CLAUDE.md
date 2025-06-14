# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains Google Apps Script (GAS) utilities for Google Docs, specifically focused on Japanese document editing workflows. The main utility automatically counts characters in document sections defined by headings and inserts character count annotations.

## Core Architecture

### `countSectionChars.gs`
- **Primary function**: `countSectionChars()` - Iterates through Google Doc body elements, identifies H1-H3 headings, counts characters in each section (including the heading itself), and inserts formatted annotations
- **Character counting logic**: Counts all text in paragraphs and list items between headings, excluding newlines
- **Annotation format**: `（このセクション：{count}文字）` - styled as small, gray, right-aligned text
- **Update behavior**: Updates existing annotations in place rather than duplicating them
- **Utility function**: `clearSectionChars()` - Removes all section character count annotations using regex pattern matching

### Key Implementation Details
- Uses DocumentApp API to manipulate Google Docs structure
- Traverses document tree using indexed child access pattern
- Handles heading hierarchy (H1, H2, H3) with same logic
- Manages annotation insertion/updates by checking for existing annotations before creating new ones
- Processes document backwards when removing annotations to avoid index shifting issues

## Development Context

This is a personal utility collection for Japanese writing workflows. The code is designed to be copied directly into Google Apps Script editor rather than deployed as a standalone application.