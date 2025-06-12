# Changelog

All notable changes to this Lo-Fi streaming platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2024-12-06

### Initial Project Creation

- Created 24/7 Lo-Fi streaming platform architecture
- Set up Next.js application with TypeScript
- Implemented core streaming engine with FFmpeg integration
- Added web interface for stream control and monitoring
- Created modular component structure for maintainability

### Stream Engine Implementation

- Built FFmpeg process management system
- Added automatic reconnection for RTMP stream drops
- Implemented real-time stream statistics parsing
- Created process monitoring with graceful shutdown
- Added automatic restart on unexpected stream failures

### Web Dashboard Development

- Created responsive React-based control interface
- Implemented tabbed navigation (Control, Media, Settings)
- Added real-time stream status monitoring
- Built live log viewing with auto-refresh
- Created stream control buttons (start/stop/restart)

### Media Management System

- Implemented file upload functionality for video and audio
- Created media file browser with selection interface
- Added playlist management for audio files
- Built file validation and organization system
- Implemented media selection persistence

### Settings Management

- Created stream configuration interface
- Added RTMP URL and stream key management
- Implemented quality settings (bitrate, resolution, FPS)
- Added audio volume control with slider interface
- Created settings validation and persistence

### API Layer Development

- Built REST API endpoints for all functionality
- Implemented stream control endpoints (start/stop/restart)
- Created media management APIs (list/save/upload)
- Added settings management endpoints
- Implemented proper error handling and JSON responses

### Changelog System

- Implemented automatic changelog generation
- Created Keep a Changelog format compliance
- Added changelog entry creation on all changes
- Built both JSON and Markdown output formats
- Integrated changelog tracking with all operations

### Initial Setup and Configuration

- Created setup script for directory structure
- Added default configuration files
- Implemented PM2 configuration for production
- Created installation script for system dependencies
- Added package.json scripts for common operations

## 2024-12-06 (Later)

### Changelog Interface Removal

- Removed changelog tab from web interface
- Deleted changelog component and API endpoints
- Simplified dashboard to 3 tabs (Control, Media, Settings)
- Maintained backend changelog tracking functionality
- Updated documentation to reflect changes

### Reasoning

- Simplified user interface by removing changelog management
- Focused web interface on operational controls only
- Kept automatic changelog tracking for development purposes
- Made changelog file-based for better version control integration

## 2024-12-06 (API Error Fixes)

### API Route Implementation

- Fixed JSON parsing errors in frontend components
- Implemented mock API routes for immediate functionality
- Added proper error handling for all API endpoints
- Created consistent response formats across all routes
- Added HTTP status codes for success and error cases

### Frontend Error Handling

- Improved fetch error handling with response.ok checks
- Added graceful degradation for failed API calls
- Implemented better error logging for debugging
- Added fallback states for unavailable services
- Created defensive programming patterns throughout

### Mock Data Implementation

- Added mock stream status with sample statistics
- Created example media files for testing interface
- Implemented default stream configuration
- Added sample log entries for monitoring panel
- Provided working interface without backend dependencies

### Reasoning

- Fixed immediate usability issues with JSON parsing errors
- Provided working interface for testing and development
- Enabled gradual replacement of mock implementations
- Improved error resilience and user experience

## 2024-12-06 (UI/UX Improvements)

### Major UI Overhaul

- **Theme Change**: Switched from dark theme to light theme for better readability
- **Contrast Fix**: Resolved text visibility issues with proper color contrast
- **Background Update**: Changed from dark backgrounds to light backgrounds
- **Text Colors**: Updated all text to use dark colors on light backgrounds

### Media Management Enhancements

- **Delete Functionality**: Added delete buttons for both video and audio files
- **Video Looping**: Implemented toggle switch for video looping control
- **File Management**: Added trash icons next to each file for easy deletion
- **Visual Feedback**: Improved file selection states with better visual indicators

### Component-Level Improvements

#### Stream Control
- Updated card backgrounds to white with gray borders
- Improved button styling with better contrast
- Enhanced status indicators with proper color coding
- Added better hover states for interactive elements

#### Media Selector
- Added file deletion functionality with confirmation
- Implemented video looping toggle with visual icon
- Improved file list display with better spacing
- Enhanced upload interface with better visual feedback
- Added selection counters for audio playlist

#### Stream Settings
- Fixed form input visibility with proper backgrounds
- Improved slider styling and labels
- Enhanced dropdown menus with better contrast
- Updated all form elements for better readability

#### Stream Monitor
- Fixed log display with proper text colors
- Improved statistics panel readability
- Enhanced card styling for better visual separation
- Updated scroll areas with better contrast

### API Enhancements

- **Delete Endpoint**: Added `/api/media/delete` route for file deletion
- **Enhanced Responses**: Improved API response handling
- **Error Management**: Better error states and user feedback
- **Validation**: Added file type and permission validation

### User Experience Improvements

- **Visual Hierarchy**: Better organization of interface elements
- **Interactive Feedback**: Clear hover and selection states
- **Error Handling**: User-friendly error messages and states
- **Responsive Design**: Maintained responsiveness across all components

### Technical Improvements

- **Component Structure**: Better separation of concerns
- **State Management**: Improved local state handling
- **Event Handling**: Better event propagation and handling
- **Performance**: Optimized re-renders and API calls

### Reasoning

- **Accessibility**: Light theme provides better accessibility and readability
- **User Request**: Direct response to contrast and visibility issues
- **Functionality**: Added requested delete and looping features
- **Professional Appearance**: More polished and professional interface
- **Maintainability**: Cleaner code structure for future development

### Files Modified

- `app/page.tsx` - Updated main page theme
- `components/stream-control.tsx` - Enhanced control interface
- `components/media-selector.tsx` - Added delete and looping features
- `components/stream-settings.tsx` - Improved settings interface
- `components/stream-monitor.tsx` - Fixed monitoring panel
- `app/api/media/delete/route.ts` - New delete endpoint

### Breaking Changes

- **Theme Change**: Existing dark theme customizations will need updates
- **API Addition**: New delete endpoint requires backend implementation
- **Component Props**: Some component interfaces updated for new features

### Migration Notes

- No migration required for existing installations
- New delete functionality requires proper file system permissions
- Video looping setting will be saved with media selections
- UI changes are automatically applied on update

## 2024-12-06 (Stream Control Fixes)

### Stream Control Improvements

- Fixed issue where Start Stream button wasn't working
- Added loading states to stream control buttons
- Implemented immediate feedback via toast notifications
- Added spinner animations during API calls
- Enhanced error handling for stream operations

### API Enhancements

- Improved API response structure for stream control endpoints
- Added simulated processing delays for better UX testing
- Enhanced error reporting from API endpoints
- Added status updates in API responses

### User Experience Improvements

- Added immediate UI updates after button clicks
- Implemented local state management for better responsiveness
- Added router.refresh() to update page data after actions
- Enhanced debugging with detailed console logs

### Technical Improvements

- Fixed button sizing to prevent layout shifts
- Maintained visual consistency during loading states
- Improved accessibility of button states
- Integrated toast notifications for non-intrusive feedback

## 2024-12-07 (Usability Enhancements)

### Automatic Media Selection

- **Auto-Select Uploads**: Newly uploaded files are now automatically selected
- **Auto-Save Selection**: Media selections are saved automatically without requiring manual save
- **Removed Save Button**: Eliminated the need for manual "Save Media Selection" button
- **Immediate Feedback**: Added visual indicators during upload and selection process
- **Loading States**: Enhanced loading states during file uploads

### Settings Change Logging

- **Settings Change Tracking**: All settings changes are now logged to Stream Logs
- **Detailed Change Records**: Each setting change is logged with before/after values
- **Timestamp Tracking**: All changes include precise timestamps
- **Visual Feedback**: Added loading state to settings save button
- **Original Settings Tracking**: Added comparison between original and new settings

### API Enhancements

- **Global Log Storage**: Implemented global mock logs for development
- **Log Integration**: Connected settings changes to stream logs
- **Upload Logging**: Added file upload events to stream logs
- **Media Selection Logging**: Added media selection changes to stream logs

### User Experience Improvements

- **Streamlined Workflow**: Reduced steps needed to select and use media files
- **Automatic Actions**: Eliminated manual steps for common operations
- **Better Feedback**: Added more visual indicators for system state
- **Informational Messages**: Added helpful text explaining automatic saving

### Technical Improvements

- **State Management**: Better handling of component state during operations
- **Event Handling**: Improved event flow for media selection
- **Error Prevention**: Reduced potential for user error by automating common tasks
- **Code Organization**: Refactored for better maintainability

### Files Modified

- `components/media-selector.tsx` - Added auto-selection and auto-save functionality
- `components/stream-settings.tsx` - Added settings change tracking and logging
- `app/api/settings/route.ts` - Enhanced to log settings changes
- `app/api/stream/logs/route.ts` - Updated to store and retrieve logs
- `app/api/media/upload/route.ts` - Modified to log uploads and mark files as selected
- `app/api/media/save/route.ts` - Enhanced to provide better logging

### Reasoning

- **User Request**: Direct implementation of requested features
- **Usability**: Streamlined workflow reduces friction and user errors
- **Transparency**: Better logging provides clearer understanding of system state
- **Efficiency**: Automatic actions reduce number of clicks needed

## 2024-12-07 (JSON Parsing Error Fixes)

### Error Resolution

- **Fixed JSON Parsing Error**: Resolved "Unexpected token 'I', "Internal s"..." error in file upload
- **Import Issues**: Fixed module import problems causing API routes to return HTML error pages
- **Response Validation**: Added proper response validation before JSON parsing
- **Error Handling**: Enhanced error handling throughout the application

### API Improvements

- **Safe Imports**: Implemented try-catch blocks around module imports
- **Fallback Functions**: Added fallback logging functions when imports fail
- **JSON Guarantee**: Ensured all API routes always return valid JSON responses
- **Content-Type Validation**: Added content-type checks before parsing responses

### Frontend Enhancements

- **Response Checking**: Added response.ok and content-type validation
- **Error Messages**: Improved error messages for different failure scenarios
- **User Feedback**: Enhanced toast notifications for various error states
- **Graceful Degradation**: Better handling of API failures

### Technical Improvements

- **Error Boundaries**: Added comprehensive error handling in API routes
- **Status Code Validation**: Proper HTTP status code handling throughout
- **Import Safety**: Used dynamic imports with fallbacks to prevent crashes
- **Response Validation**: Multiple layers of response validation

### Files Modified

- `app/api/media/upload/route.ts` - Fixed import issues and added error handling
- `app/api/media/save/route.ts` - Enhanced error handling and response validation
- `app/api/settings/route.ts` - Improved import safety and error handling
- `components/media-selector.tsx` - Added response validation and better error handling

### Reasoning

- **Error Prevention**: Prevent API routes from returning HTML error pages
- **User Experience**: Provide clear feedback when errors occur
- **Reliability**: Make the application more robust and error-resistant
- **Debugging**: Better error messages for easier troubleshooting

## 2024-12-07 (Logging System Overhaul)

### Centralized Logging System

- **New Logger Class**: Created a centralized logging system in `lib/logger.ts`
- **Singleton Pattern**: Implemented singleton logger instance for consistent logging
- **Memory Management**: Added automatic log rotation to prevent memory issues
- **Persistent Logs**: Logs now persist properly across API calls

### Stream Logs Functionality

- **Settings Change Logging**: Fixed issue where Stream Settings changes weren't appearing in logs
- **Upload Logging**: Added comprehensive logging for file uploads (video and audio)
- **Detailed Messages**: Enhanced log messages with more specific information
- **Real-time Updates**: Stream Logs now update immediately when actions are performed

### Enhanced Logging Coverage

- **Settings Changes**: All settings modifications are now logged with before/after values
- **File Uploads**: Upload events are logged with file names and auto-selection status
- **Media Selection**: Media selection changes are logged with detailed information
- **Stream Control**: All stream start/stop/restart actions are logged
- **File Deletion**: File deletion events are logged with file names
- **Error Logging**: All errors are now properly logged for debugging

### API Improvements

- **Consistent Logging**: All API routes now use the centralized logger
- **Error Handling**: Better error logging throughout all endpoints
- **Status Messages**: More informative log messages for all operations
- **Import Safety**: Removed problematic import patterns that were causing issues

### User Experience Improvements

- **Real-time Feedback**: Stream Logs update immediately after actions
- **Detailed Information**: More informative log messages
- **Better Debugging**: Easier to track what's happening in the system
- **Automatic Updates**: No need to manually refresh logs

### Technical Improvements

- **Memory Efficiency**: Automatic log cleanup prevents memory leaks
- **Type Safety**: Proper TypeScript implementation for the logger
- **Error Resilience**: Logger continues working even if individual operations fail
- **Performance**: Efficient logging that doesn't impact application performance

### Files Modified

- `lib/logger.ts` - New centralized logging system
- `app/api/stream/logs/route.ts` - Updated to use new logger
- `app/api/settings/route.ts` - Enhanced settings change logging
- `app/api/media/upload/route.ts` - Added comprehensive upload logging
- `app/api/media/save/route.ts` - Improved media selection logging
- `app/api/media/delete/route.ts` - Added file deletion logging
- `app/api/stream/start/route.ts` - Enhanced stream control logging
- `app/api/stream/stop/route.ts` - Enhanced stream control logging
- `app/api/stream/restart/route.ts` - Enhanced stream control logging

### Bug Fixes

- **Settings Logging**: Fixed issue where settings changes weren't appearing in Stream Logs
- **Upload Logging**: Fixed missing upload events in Stream Logs
- **Import Errors**: Resolved module import issues that were causing API failures
- **Log Persistence**: Fixed logs not persisting between API calls

### Reasoning

- **User Request**: Direct response to reported logging issues
- **System Transparency**: Better visibility into system operations
- **Debugging**: Easier troubleshooting and monitoring
- **Reliability**: More robust logging system that doesn't fail
- **User Experience**: Immediate feedback for all user actions

## 2025-06-12

### Major Functionality Improvements

- **Fixed API Persistence**: Updated API endpoints to properly save and retrieve data
  - Media uploads now persist between page refreshes
  - Settings are properly saved and retrieved
  - Stream status is correctly maintained between tab changes

- **Stream Engine Enhancements**:
  - Implemented proper FFmpeg process management
  - Fixed stream stopping functionality to reliably terminate FFmpeg processes
  - Added multiple fallback mechanisms for process termination
  - Improved audio playlist handling for continuous playback
  - Implemented Constant Bit Rate (CBR) streaming for better stability

- **Audio Streaming Improvements**:
  - Fixed silent stream issue by properly configuring audio inputs
  - Implemented proper audio playlist looping
  - Added explicit stream mapping for video and audio
  - Enhanced audio settings with stereo output
  - Fixed audio looping issue where audio would repeat every few seconds
  - Fixed invalid data error in audio playlist format
  - Added audio synchronization with "-async 1" flag
  - Removed problematic duration metadata that was causing stream failures

- **Error Handling**:
  - Added graceful error handling for stream operations
  - Improved logging for better debugging
  - Fixed process termination issues

### Technical Improvements

- **FFmpeg Configuration**:
  - Switched from Variable Bit Rate (VBR) to Constant Bit Rate (CBR)
  - Added `-minrate` equal to target bitrate for stability
  - Set `-maxrate` equal to target bitrate to prevent fluctuations
  - Added `-tune zerolatency` for reduced latency
  - Added `-profile:v main` and `-level 4.1` for better compatibility
  - Implemented proper audio channel configuration with `-ac 2`

- **Process Management**:
  - Added external FFmpeg process detection and termination
  - Improved process monitoring and cleanup
  - Added fallback timeout mechanisms for reliable termination
  - Enhanced logging of process states and operations

- **File Path Handling**:
  - Fixed file path issues in media manager
  - Improved path escaping for FFmpeg compatibility
  - Added detailed logging of file paths for debugging

### Bug Fixes

- **Stream Control**:
  - Fixed issue where FFmpeg processes would continue running after stop
  - Fixed stream status not persisting between tab changes
  - Added proper state handling in StreamControl component

- **Media Management**:
  - Fixed media list endpoint to show actual uploaded files
  - Corrected file path handling in media uploads
  - Fixed media selection persistence between page refreshes

- **Audio Playback**:
  - Fixed silent stream issue by properly configuring audio inputs
  - Corrected audio playlist format for FFmpeg compatibility
  - Added proper stream mapping for audio tracks

### Files Modified

- `app/api/media/list/route.ts` - Updated to fetch actual media files
- `app/api/media/upload/route.ts` - Fixed to properly save uploaded files
- `app/api/media/save/route.ts` - Enhanced to save media selection
- `app/api/settings/route.ts` - Updated to save and retrieve actual settings
- `app/api/stream/status/route.ts` - Modified to use actual stream status
- `app/api/stream/start/route.ts` - Updated to actually start the stream
- `app/api/stream/stop/route.ts` - Enhanced to properly stop the stream
- `app/api/stream/restart/route.ts` - Fixed to properly restart the stream
- `lib/stream-engine.ts` - Major improvements to FFmpeg handling and process management
- `lib/media-manager.ts` - Fixed file path handling and selection persistence
- `components/stream-control.tsx` - Added proper state handling for stream status
