import React, { ReactNode, Suspense } from 'react'
import i18n from '@/i18n/i18n'
import { ShellReceiver } from '../pages/reverseShellReceiver/shellReceiver'
import { PcapXDemo } from '@/components/playground/PcapXDemo'
import { DataCompare } from '../pages/compare/DataCompare'
import { HTTPHistory } from '../components/HTTPHistory'
import { PortAssetTable } from '../pages/assetViewer/PortAssetPage'
import { DomainAssetPage } from '../pages/assetViewer/DomainAssetPage'
import { RiskPage } from '../pages/risks/RiskPage'
import { DNSLogPage } from '../pages/dnslog/DNSLogPage'
import { ICMPSizeLoggerPage } from '../pages/icmpsizelog/ICMPSizeLoggerPage'
import { RandomPortLogPage } from '../pages/randomPortLog/RandomPortLogPage'
import { ReportViewerPage } from '../pages/assetViewer/ReportViewerPage'
import { StartFacadeServerParams } from '../pages/reverseServer/ReverseServer_New'
import { JavaPayloadPage } from '@/pages/payloadGenerater/NewJavaPayloadPage'
import { NewReverseServerPage } from '@/pages/reverseServer/NewReverseServerPage'
import { AccountAdminPage } from '@/pages/loginOperationMenu/AccountAdminPage'
import { RoleAdminPage } from '@/pages/loginOperationMenu/RoleAdminPage'
import { HoleCollectPage } from '@/pages/loginOperationMenu/HoleCollectPage'
import { LicenseAdminPage } from '@/pages/loginOperationMenu/LicenseAdminPage'
import { TrustListPage } from '@/pages/loginOperationMenu/TrustListPage'
import { ChaosMakerPage } from '@/pages/chaosmaker/ChaosMaker'
import { ScreenRecorderPage } from '@/pages/screenRecorder/ScreenRecorderPage'
import { CVEViewer } from '@/pages/cve/CVEViewer'
import { YakJavaDecompiler } from '@/pages/yakJavaDecompiler/YakJavaDecompiler'
import { PageLoading } from './PageLoading'
import {
  PrivateOutlineAIAgentIcon,
  PrivateOutlineAuditCodeIcon,
  PrivateOutlineAuditHoleIcon,
  PrivateOutlineBasicCrawlerIcon,
  PrivateOutlineBatchPluginIcon,
  PrivateOutlineBruteIcon,
  PrivateOutlineCVEIcon,
  PrivateOutlineCodeScanIcon,
  PrivateOutlineCodecIcon,
  PrivateOutlineDNSLogIcon,
  PrivateOutlineDataCompareIcon,
  PrivateOutlineDefaultPluginIcon,
  PrivateOutlineDirectoryScanningIcon,
  PrivateOutlineDomainIcon,
  PrivateOutlineFingerprintManageIcon,
  PrivateOutlineHTTPHistoryIcon,
  PrivateOutlineICMPSizeLogIcon,
  PrivateOutlineMitmIcon,
  PrivateOutlinePayloadGeneraterIcon,
  PrivateOutlinePluginStoreIcon,
  PrivateOutlinePocIcon,
  PrivateOutlinePortsIcon,
  PrivateOutlineProjectManagerIcon,
  PrivateOutlineReportIcon,
  PrivateOutlineReverseServerIcon,
  PrivateOutlineRiskIcon,
  PrivateOutlineRuleManagementIcon,
  PrivateOutlineScanPortIcon,
  PrivateOutlineShellReceiverIcon,
  PrivateOutlineSpaceEngineIcon,
  PrivateOutlineSubDomainCollectionIcon,
  PrivateOutlineTCPPortLogIcon,
  PrivateOutlineWebFuzzerIcon,
  PrivateOutlineWebsocketFuzzerIcon,
  PrivateSolidAuditCodeIcon,
  PrivateSolidAuditHoleIcon,
  PrivateSolidBasicCrawlerIcon,
  PrivateSolidBatchPluginIcon,
  PrivateSolidBruteIcon,
  PrivateSolidCVEIcon,
  PrivateSolidCodeScanIcon,
  PrivateSolidCodecIcon,
  PrivateSolidDNSLogIcon,
  PrivateSolidDataCompareIcon,
  PrivateSolidDefaultPluginIcon,
  PrivateSolidDirectoryScanningIcon,
  PrivateSolidDomainIcon,
  PrivateSolidFingerprintManageIcon,
  PrivateSolidHTTPHistoryIcon,
  PrivateSolidICMPSizeLogIcon,
  PrivateSolidMitmIcon,
  PrivateSolidPayloadGeneraterIcon,
  PrivateSolidPluginStoreIcon,
  PrivateSolidPocIcon,
  PrivateSolidPortsIcon,
  PrivateSolidProjectManagerIcon,
  PrivateSolidReportIcon,
  PrivateSolidReverseServerIcon,
  PrivateSolidRiskIcon,
  PrivateSolidRuleManagementIcon,
  PrivateSolidScanPortIcon,
  PrivateSolidShellReceiverIcon,
  PrivateSolidSpaceEngineIcon,
  PrivateSolidSubDomainCollectionIcon,
  PrivateSolidTCPPortLogIcon,
  PrivateSolidWebFuzzerIcon,
  PrivateSolidWebsocketFuzzerIcon,
  PrivateSolidAIAgentIcon,
} from './privateIcon'
import { ControlAdminPage } from '@/pages/dynamicControl/DynamicControl'
import { DebugMonacoEditorPage } from '@/pages/debugMonaco/DebugMonacoEditorPage'
import { VulinboxManager } from '@/pages/vulinbox/VulinboxManager'
import { DiagnoseNetworkPage } from '@/pages/diagnoseNetwork/DiagnoseNetworkPage'
import HTTPFuzzerPage, { AdvancedConfigShowProps } from '@/pages/fuzzer/HTTPFuzzerPage'
import { ErrorBoundary } from 'react-error-boundary'
import { PageItemProps } from '@/pages/layout/mainOperatorContent/renderSubPage/RenderSubPageType'
import { WebShellViewer } from '@/pages/webShell/WebShellViewer'
import { WebShellDetail } from '@/pages/webShell/models'
import { WebShellDetailOpt } from '@/pages/webShell/WebShellDetailOpt'
import {
  FuzzerParamItem,
  AdvancedConfigValueProps,
} from '@/pages/fuzzer/HttpQueryAdvancedConfig/HttpQueryAdvancedConfigType'
import { HTTPResponseExtractor } from '@/pages/fuzzer/MatcherAndExtractionCard/MatcherAndExtractionCardType'
import { ConfigNetworkPage } from '@/components/configNetwork/ConfigNetworkPage'
import { PluginManage } from '@/pages/plugins/manage/PluginManage'
import { OnlineJudgment } from '@/pages/plugins/onlineJudgment/OnlineJudgment'
import {
  isMemfit,
  isCommunityEdition,
  isIRify,
  isYakit,
  isEnpriTraceAgent,
  isEnpriTrace,
  isCommunityYakit,
} from '@/utils/envfile'
import { NewPayload } from '@/pages/payloadManager/newPayload'
import { NewCodec } from '@/pages/codec/NewCodec'
import { DataStatistics } from '@/pages/dataStatistics/DataStatistics'
import { PluginBatchExecutor } from '@/pages/plugins/pluginBatchExecutor/pluginBatchExecutor'
import {
  AddYakitScriptPageInfoProps,
  AuditCodePageInfoProps,
  BrutePageInfoProps,
  CodeScanPageInfoProps,
  HTTPHackerPageInfoProps,
  MITMHackerPageInfoProps,
  HTTPHistoryAnalysisPageInfo,
  ModifyNotepadPageInfoProps,
  PluginBatchExecutorPageInfoProps,
  PocPageInfoProps,
  RiskPageInfoProps,
  ScanPortPageInfoProps,
  SimpleDetectPageInfoProps,
  SpaceEnginePageInfoProps,
  WebsocketFuzzerPageInfoProps,
  AIForgeEditorPageInfoProps,
  AIToolEditorPageInfoProps,
  YakRunnerScanHistoryPageInfoProps,
  RuleManagementPageInfoProps,
  AuditHoleInfoProps,
  AIRepositoryProps,
} from '@/store/pageInfo'
import { SpaceEnginePage } from '@/pages/spaceEngine/SpaceEnginePage'
import { SinglePluginExecution } from '@/pages/plugins/singlePluginExecution/SinglePluginExecution'
import { YakPoC } from '@/pages/securityTool/yakPoC/YakPoC'
import { NewPortScan } from '@/pages/securityTool/newPortScan/NewPortScan'
import { NewBrute } from '@/pages/securityTool/newBrute/NewBrute'
import {
  CommunityDeprecatedFirstMenu,
  CommunityDeprecatedSecondMenu,
  EnterpriseDeprecatedFirstMenu,
  EnterpriseDeprecatedSecondMenu,
} from './deprecatedMenu'
import { SimpleDetect } from '@/pages/simpleDetect/SimpleDetect'
import { YakitRoute } from '../enums/yakitRoute'
import { YakRunner } from '@/pages/yakRunner/YakRunner'
import { IrifyAiCodeAuditPage } from '@/pages/irifyAiCodeAudit/IrifyAiCodeAuditPage'
import { YakRunnerCodeScan } from '@/pages/yakRunnerCodeScan/YakRunnerCodeScan'
import { YakRunnerAuditCode } from '@/pages/yakRunnerAuditCode/YakRunnerAuditCode'
import { AddYakitPlugin } from '@/pages/pluginEditor/addYakitPlugin/AddYakitPlugin'
import { WebsocketFuzzer } from '@/pages/websocket/WebsocketFuzzer'
import { YakRunnerProjectManager } from '@/pages/YakRunnerProjectManager/YakRunnerProjectManager'
import { RuleManagement } from '@/pages/ruleManagement/RuleManagement'
import { YakRunnerAuditHole } from '@/pages/yakRunnerAuditHole/YakRunnerAuditHole'
import { Misstatement } from '@/pages/misstatement/Misstatement'
import { SystemConfig } from '@/pages/systemConfig/SystemConfig'
import { HTTPHistoryAnalysis } from '@/pages/hTTPHistoryAnalysis/HTTPHistoryAnalysis'
import { ShortcutKeyPageName } from '@/utils/globalShortcutKey/events/pageMaps'
import { getNotepadAdd, getNotepadManage, getNotepadNameByEditionMulLang } from '@/pages/layout/NotepadMenu/utils'
import { ShortcutKeyList } from '@/pages/shortcutKey/ShortcutKey'
import { AIAgent } from '@/pages/ai-agent/AIAgent'
import { SolidClipboardlistIcon, SolidCodecIcon, SolidTerminalIcon } from '@/assets/icon/solid'
import { PublicToolDataCompareIcon, PublicToolVulinboxIcon } from './publicIcon'
import { SoftMode, YakitModeEnum } from '@/store/softMode'

const HTTPHacker = React.lazy(() => import('../pages/hacker/httpHacker'))
const MITMHacker = React.lazy(() => import('@/pages/mitm/MITMHacker/MITMHacker'))
const Home = React.lazy(() => import('@/pages/home/Home'))
const IRifyHome = React.lazy(() => import('@/pages/irifyHome/IRifyHome'))
const WebFuzzerPage = React.lazy(() => import('@/pages/fuzzer/WebFuzzerPage/WebFuzzerPage'))
const PluginHub = React.lazy(() => import('@/pages/pluginHub/pluginHub/PluginHub'))
const ModifyNotepad = React.lazy(() => import('@/pages/notepadManage/modifyNotepad/ModifyNotepad'))
const NotepadManage = React.lazy(() => import('@/pages/notepadManage/notepadManage/NotepadManage'))
const FingerprintManage = React.lazy(() => import('@/pages/fingerprintManage/FingerprintManage'))
const SsaResDiff = React.lazy(() => import('@/pages/ssaResDiff/SsaResDiff'))
const KnowledgeBase = React.lazy(() => import('@/pages/KnowledgeBase/KnowledgeBasePage'))
const ForgeEditor = React.lazy(() => import('@/pages/aiForge/forgeEditor/ForgeEditor'))
const AIToolEditor = React.lazy(() => import('@/pages/aiTool/AIToolEditor/AIToolEditor'))
const YakRunnerScanHistory = React.lazy(() => import('@/pages/yakRunnerScanHistory/YakRunnerScanHistory'))
const SSACompileHistory = React.lazy(() => import('@/pages/ssaCompileHistory/SSACompileHistory'))
const MemoryBase = React.lazy(() => import('@/pages/memoryBase/MemoryBase'))
const ConfigManagement = React.lazy(() => import('@/pages/configManagement/ConfigManagement'))
const AITool = React.lazy(() => import('@/pages/aiTool/AITool'))
const AIForge = React.lazy(() => import('@/pages/aiForge/AIForge'))

/**
 * @description 页面路由对应的页面信息
 * * label-页面名称
 * * describe(非必需)-页面描述语
 */
export const YakitRouteToPageInfo: Record<
  YakitRoute,
  { label: string; labelUi?: string; describe?: string; describeUi?: string }
> = {
  'new-home': { label: 'Home', labelUi: 'YakitRoute.home' },
  httpHacker: {
    label: 'MITM Interactive Hijacking v1',
    labelUi: 'YakitRoute.MITM',
    describeUi: 'YakitRoute.mitmSslHijack',
  },
  'mitm-hijack': {
    label: 'MITM Interactive Hijacking',
    labelUi: 'YakitRoute.MITM',
    describeUi: 'YakitRoute.mitmSslHijack',
  },
  httpFuzzer: {
    label: 'Web Fuzzer',
    labelUi: 'YakitRoute.WebFuzzer',
    describeUi: 'YakitRoute.fuzzBurpIntegration',
  },
  'websocket-fuzzer': {
    label: 'Websocket Fuzzer',
    labelUi: 'YakitRoute.Websocket Fuzzer',
    describeUi: 'YakitRoute.fuzzTestingForWebSocketPackets',
  },
  codec: {
    label: 'Codec',
    labelUi: 'YakitRoute.Codec',
    describeUi: 'YakitRoute.dataProcessingDescription',
  },
  dataCompare: {
    label: 'Data Compare',
    labelUi: 'YakitRoute.dataCompare',
    describeUi: 'YakitRoute.quicklyIdentifyDifferencesInData',
  },
  'scan-port': {
    label: 'Port/Fingerprint Scan',
    labelUi: 'YakitRoute.portAndFingerprintScan',
    describeUi: 'YakitRoute.portScanDescription',
  },
  poc: {
    label: 'Targeted Vulnerability Scan',
    labelUi: 'YakitRoute.vulnTargetedScan',
    describeUi: 'YakitRoute.vulnerabilityDetectionDescription',
  },
  'plugin-op': { label: 'Plugin', labelUi: 'YakitRoute.plugin' },
  brute: {
    label: 'Weak Password Check',
    labelUi: 'YakitRoute.weakPasswordCheck',
    describeUi: 'YakitRoute.bruteForceDescription',
  },
  'plugin-hub': {
    label: 'Plugin Hub',
    labelUi: 'YakitRoute.pluginHub',
    describeUi: 'YakitRoute.massiveYakitPluginsOne-ClickDownload',
  },
  'batch-executor-page-ex': {
    label: 'Batch Execute',
    labelUi: 'YakitRoute.batchExecute',
    describeUi: 'YakitRoute.batchPOCScan',
  },
  dnslog: {
    label: 'DNSLog',
    labelUi: 'YakitRoute.DNSLog',
    describeUi: 'YakitRoute.subdomainAutoGenerate',
  },
  'icmp-sizelog': {
    label: 'ICMP-SizeLog',
    labelUi: 'YakitRoute.ICMP-SizeLog',
    describeUi: 'YakitRoute.detectICMPCallbackViaPingWithSpecificPacketSize',
  },
  'tcp-portlog': {
    label: 'TCP-PortLog',
    labelUi: 'YakitRoute.TCP-PortLog',
    describeUi: 'YakitRoute.detectTCPCallbackViaRandomClosedPorts',
  },
  PayloadGenerater_New: {
    label: 'Yso-Java Hack',
    labelUi: 'YakitRoute.Yso-Java Hack',
    describeUi: 'YakitRoute.fuzzPayLoadDeserialization',
  },
  ReverseServer_New: {
    label: 'Reverse Server',
    labelUi: 'YakitRoute.reverseServer',
    describeUi: 'YakitRoute.simultaneouslyProvideHTTP/RMI/HTTPSReverseConnectionsOnOnePort',
  },
  shellReceiver: {
    label: 'Port Listener',
    labelUi: 'YakitRoute.portListener',
    describeUi: 'YakitRoute.reverseShellTool',
  },
  'db-http-request': {
    label: 'History',
    labelUi: 'YakitRoute.History',
    describeUi: 'YakitRoute.viewAndManageAllHistoricalTrafficFromMITMPluginsAndFuzzing',
  },
  'db-http-request-analysis': { label: 'Traffic Analyzer', labelUi: 'YakitRoute.historyAnalyzer' },
  'db-reports-results': {
    label: 'Reports',
    labelUi: 'YakitRoute.report',
    describeUi: 'YakitRoute.viewAndManageReportsGeneratedDuringScanning',
  },
  'db-risks': {
    label: 'Vulnerabilities & Risks',
    labelUi: 'YakitRoute.vulnerabilityAndrisk',
    describeUi: 'YakitRoute.manageAllDetectedVulnerabilitiesAndRisks',
  },
  misstatement: { label: 'False Positive Records', labelUi: 'YakitRoute.falsePositiveRecords' },
  'db-ports': { label: 'Ports', labelUi: 'YakitRoute.port', describeUi: 'YakitRoute.manageAllDiscoveredPortAssets' },
  'db-domains': {
    label: 'Domains',
    labelUi: 'YakitRoute.domain',
    describeUi: 'YakitRoute.manageAllDiscoveredDomainAssets',
  },
  cve: { label: 'CVE Management', labelUi: 'YakitRoute.cVEManagement', describeUi: 'YakitRoute.searchAndQueryCVEData' },
  yakScript: {
    label: 'Yak Runner',
    labelUi: 'YakitRoute.YakRunner',
    describeUi: 'YakitRoute.yaklangProgramming',
  },
  'payload-manager': {
    label: 'Payload Management',
    labelUi: 'YakitRoute.Payload',
    describeUi: 'YakitRoute.customPayload',
  },
  'account-admin-page': { label: 'User Management', labelUi: 'YakitRoute.userManagement' },
  'role-admin-page': { label: 'Role Management', labelUi: 'YakitRoute.roleManagement' },
  'hole-collect-page': { label: 'Vulnerability Summary', labelUi: 'YakitRoute.vulnerabilitySummary' },
  'license-admin-page': { label: 'License Management', labelUi: 'YakitRoute.licenseManagement' },
  'trust-list-admin-page': { label: 'User Management', labelUi: 'YakitRoute.userManagement' },
  'plug-in-admin-page': { label: 'Plugin Permissions', labelUi: 'YakitRoute.pluginPermissions' },
  'control-admin-page': { label: 'Remote Management', labelUi: 'YakitRoute.remoteManagement' },
  'batch-executor-recover': {
    label: 'Resume Task: Batch Plugin Execution',
    labelUi: 'YakitRoute.continueTaskBatchExecutePlugin',
  },
  'packet-scan-page': { label: 'Packet Scan', labelUi: 'YakitRoute.packetScan' },
  'add-yakit-script': { label: 'Create Plugin', labelUi: 'YakitRoute.createPlugin' },
  'simple-detect': { label: 'Security Check', labelUi: 'YakitRoute.securityCheck' },
  'screen-recorder-page': {
    label: 'Recording Management',
    labelUi: 'YakitRoute.recordingManagement',
    describeUi: 'YakitRoute.manageAllRecordedVideoFiles',
  },
  'db-chaosmaker': { label: 'BAS Lab', labelUi: 'YakitRoute.BASLab' },
  'beta-debug-monaco-editor': { label: 'Plugin Editor', labelUi: 'YakitRoute.pluginEditor' },
  'beta-vulinbox-manager': { label: 'Vulinbox Manager', labelUi: 'YakitRoute.vulinboxManager' },
  'beta-diagnose-network': { label: 'Network Diagnosis', labelUi: 'YakitRoute.networkDiagnosis' },
  'beta-config-network': { label: 'Global Config', labelUi: 'YakitRoute.globalConfig' },
  'plugin-audit': { label: 'Plugin Management', labelUi: 'YakitRoute.pluginManagement' },
  '**beta-debug-traffic-analize': { label: 'Traffic Analysis', labelUi: 'YakitRoute.trafficAnalysis' },
  'beta-webshell-manager': { label: 'Website Management', labelUi: 'YakitRoute.websiteManagement' },
  'beta-webshell-opt': { label: 'WebShell Instance', labelUi: 'YakitRoute.webShellInstance' },
  data_statistics: { label: 'Data Statistics', labelUi: 'YakitRoute.dataStatistics' },
  'space-engine': { label: 'Space Engine', labelUi: 'YakitRoute.spaceEngine' },
  'yakrunner-code-scan': {
    label: 'Code Scan',
    labelUi: 'YakitRoute.codeScan',
    describeUi: 'YakitRoute.richRuleLibrary',
  },
  'yakrunner-audit-code': {
    label: 'Code Audit',
    labelUi: 'YakitRoute.codeAudit',
    describeUi: 'YakitRoute.auditRuleCodeAnalysis',
  },
  'irify-ai-code-audit': {
    label: 'AI Code Audit',
    labelUi: 'YakitRoute.irifyAiCodeAudit',
    describeUi: 'YakitRoute.irifyAiCodeAuditDescribe',
  },
  'yakrunner-project-manager': { label: 'Project Management', labelUi: 'YakitRoute.projectManagement' },
  yakrunner_scanHistory: { label: 'Project History', labelUi: 'YakitRoute.projectHistory' },
  'rule-management': {
    label: 'Rule Management',
    labelUi: 'YakitRoute.ruleManagement',
    describeUi: 'YakitRoute.customAuditRules',
  },
  'notepad-manage': {
    label: getNotepadManage(),
    describeUi: 'YakitRoute.penetrationRecordDescription',
  },
  'modify-notepad': {
    label: getNotepadNameByEditionMulLang(),
  },
  'yakrunner-audit-hole': { label: 'Audit Vulnerabilities', labelUi: 'YakitRoute.auditVulnerability' },
  'system-config': { label: 'System Config', labelUi: 'YakitRoute.systemConfig' },
  'yak-java-decompiler': { label: 'Java Decompiler', labelUi: 'YakitRoute.javaDecompile' },
  'shortcut-key': { label: 'Shortcut Settings', labelUi: 'YakitRoute.shortcutSettings' },
  'fingerprint-manage': { label: 'Fingerprint Database', labelUi: 'YakitRoute.fingerprintDatabase' },
  'ai-agent': { label: 'AIAgent', labelUi: 'YakitRoute.AIAgent' },
  'ssa-result-diff': { label: 'ssa-result-diff', labelUi: 'YakitRoute.ssa-result-diff' },
  'ai-repository': { label: 'Knowledge Base', labelUi: 'YakitRoute.ai-repository' },
  'add-ai-forge': { label: 'Create Forge', labelUi: 'YakitRoute.createForge' },
  'modify-ai-forge': { label: 'Edit Forge', labelUi: 'YakitRoute.editForge' },
  'add-ai-tool': { label: 'Create Tool', labelUi: 'YakitRoute.createTool' },
  'modify-ai-tool': { label: 'Edit Tool', labelUi: 'YakitRoute.editTool' },
  'ssa-compile-history': { label: 'SSA Compile History', labelUi: 'YakitRoute.ssaCompileHistory' },
  'config-management': {
    label: 'Configuration Management',
    labelUi: 'YakitRoute.configManagement',
    describeUi: 'YakitRoute.unifiedConfigurationManagementForPayloadProxyAndHotPatch',
  },
  'ai-memory': { label: 'Memory Base', labelUi: 'YakitRoute.ai-memory' },
  'ai-tool': { label: 'Tool Library', labelUi: 'YakitRoute.ai-tool' },
  'ai-forge': { label: 'Forge Library', labelUi: 'YakitRoute.ai-forge' },
}
/** 页面路由(无法多开的页面) */
export const SingletonPageRoute: YakitRoute[] = [
  YakitRoute.NewHome,
  YakitRoute.HTTPHacker,
  YakitRoute.MITMHacker,
  YakitRoute.Plugin_Hub,
  YakitRoute.DNSLog,
  YakitRoute.ICMPSizeLog,
  YakitRoute.TCPPortLog,
  YakitRoute.DB_HTTPHistory,
  YakitRoute.DB_Report,
  YakitRoute.DB_Risk,
  YakitRoute.Misstatement,
  YakitRoute.DB_Ports,
  YakitRoute.DB_Domain,
  YakitRoute.DB_CVE,
  YakitRoute.YakScript,
  YakitRoute.PayloadManager,
  YakitRoute.ConfigManagement,
  YakitRoute.AccountAdminPage,
  YakitRoute.RoleAdminPage,
  YakitRoute.HoleCollectPage,
  YakitRoute.LicenseAdminPage,
  YakitRoute.TrustListPage,
  YakitRoute.AddYakitScript,
  YakitRoute.DB_ChaosMaker,
  YakitRoute.ScreenRecorderPage,
  YakitRoute.ControlAdminPage,
  YakitRoute.Beta_VulinboxManager,
  YakitRoute.Beta_DiagnoseNetwork,
  YakitRoute.Beta_ConfigNetwork,
  YakitRoute.Beta_DebugTrafficAnalize,
  YakitRoute.Plugin_Audit,
  YakitRoute.Beta_WebShellManager,
  YakitRoute.Data_Statistics,
  YakitRoute.YakRunner_Audit_Code,
  YakitRoute.Irify_AI_Code_Audit,
  YakitRoute.YakRunner_Project_Manager,
  YakitRoute.YakRunner_ScanHistory,
  YakitRoute.Rule_Management,
  YakitRoute.Notepad_Manage,
  YakitRoute.YakRunner_Audit_Hole,
  YakitRoute.System_Config,
  YakitRoute.Yak_Java_Decompiler,
  YakitRoute.ShortcutKey,
  YakitRoute.FingerprintManage,
  YakitRoute.AI_Agent,
  YakitRoute.Ssa_Result_Diff,
  YakitRoute.AddAIForge,
  YakitRoute.ModifyAIForge,
  YakitRoute.AddAITool,
  YakitRoute.ModifyAITool,
  YakitRoute.AI_REPOSITORY,
  YakitRoute.AI_Memory,
  YakitRoute.AI_Tool,
  YakitRoute.AI_Forge,
]
/** 不需要软件安全边距的页面路由 */
export const NoPaddingRoute: YakitRoute[] = [
  YakitRoute.PayloadGenerater_New,
  YakitRoute.ReverseServer_New,
  YakitRoute.DataCompare,
  YakitRoute.YakScript,
  YakitRoute.HTTPHacker,
  YakitRoute.MITMHacker,
  YakitRoute.Plugin_Hub,
  YakitRoute.ICMPSizeLog,
  YakitRoute.TCPPortLog,
  YakitRoute.DNSLog,
  YakitRoute.NewHome,
  YakitRoute.DB_CVE,
  YakitRoute.HTTPFuzzer,
  YakitRoute.DB_Ports,
  YakitRoute.DB_HTTPHistory,
  YakitRoute.DB_HTTPHistoryAnalysis,
  YakitRoute.Plugin_Audit,
  YakitRoute.AddYakitScript,
  YakitRoute.PayloadManager,
  YakitRoute.ConfigManagement,
  YakitRoute.Data_Statistics,
  YakitRoute.BatchExecutorPage,
  YakitRoute.Codec,
  YakitRoute.Space_Engine,
  YakitRoute.Plugin_OP,
  YakitRoute.PoC,
  YakitRoute.Mod_ScanPort,
  YakitRoute.Mod_Brute,
  YakitRoute.SimpleDetect,
  YakitRoute.DB_Risk,
  YakitRoute.Misstatement,
  YakitRoute.ShellReceiver,
  YakitRoute.YakRunner_Code_Scan,
  YakitRoute.YakRunner_Audit_Code,
  YakitRoute.Irify_AI_Code_Audit,
  YakitRoute.YakRunner_Project_Manager,
  YakitRoute.YakRunner_ScanHistory,
  YakitRoute.Rule_Management,
  YakitRoute.Modify_Notepad,
  YakitRoute.Notepad_Manage,
  YakitRoute.YakRunner_Audit_Hole,
  YakitRoute.Yak_Java_Decompiler,
  YakitRoute.ShortcutKey,
  YakitRoute.FingerprintManage,
  YakitRoute.AI_Agent,
  YakitRoute.Ssa_Result_Diff,
  YakitRoute.AddAIForge,
  YakitRoute.ModifyAIForge,
  YakitRoute.AddAITool,
  YakitRoute.ModifyAITool,
  YakitRoute.AI_REPOSITORY,
  YakitRoute.AI_Memory,
  YakitRoute.AI_Tool,
  YakitRoute.AI_Forge,
]
/** 无滚动条的页面路由 */
export const NoScrollRoutes: YakitRoute[] = [
  YakitRoute.HTTPHacker,
  YakitRoute.MITMHacker,
  YakitRoute.Mod_Brute,
  YakitRoute.YakScript,
  YakitRoute.AI_Agent,
  YakitRoute.ShortcutKey,
  YakitRoute.YakRunner_ScanHistory,
]

/** 通过版本获取一级tab固定展示tab  */
export const getDefaultFixedTabs = (softMode: SoftMode) => {
  if (isMemfit()) {
    return [YakitRoute.AI_Agent, YakitRoute.AI_REPOSITORY]
  }
  if (isIRify()) {
    return [YakitRoute.NewHome]
  }
  if (isYakit()) {
    if (isEnpriTraceAgent()) {
      return []
    }
    if (isEnpriTrace()) {
      return [YakitRoute.NewHome, YakitRoute.DB_HTTPHistory]
    }
    if (isCommunityYakit()) {
      if (softMode === YakitModeEnum.SecurityExpert) {
        return [YakitRoute.MITMHacker, YakitRoute.HTTPFuzzer, YakitRoute.DB_HTTPHistory]
      } else if (softMode === YakitModeEnum.Classic || softMode === YakitModeEnum.Scan) {
        return [YakitRoute.NewHome, YakitRoute.DB_HTTPHistory]
      }
      return []
    }
    return []
  }
  return []
}
/** 一级tab固定展示tab支持多开页面 */
export const getDefaultFixedTabsNoSinglPageRoute = (softMode: SoftMode) => {
  if (isYakit()) {
    if (isEnpriTraceAgent()) {
      return []
    }
    if (isCommunityYakit()) {
      if (softMode === YakitModeEnum.SecurityExpert) {
        return [YakitRoute.HTTPFuzzer]
      }
      return []
    }
    return []
  }
  return []
}
/** 用户退出登录后，需自动关闭的页面 */
export const LogOutCloseRoutes: YakitRoute[] = [YakitRoute.Plugin_Audit, YakitRoute.Data_Statistics]

export interface ComponentParams {
  // 是否跳转到新开页面 默认跳转
  openFlag?: boolean
  // Route.HTTPFuzzer 参数---start
  isHttps?: boolean
  request?: string
  system?: string
  advancedConfigValue?: AdvancedConfigValueProps
  advancedConfigShow?: AdvancedConfigShowProps | null
  hotPatchCode?: string
  // Route.HTTPFuzzer 参数---end

  // order?: string
  /**@param id 页面唯一标识id HTTPFuzzer/SimpleDetect必须要有的，其他页面可以不用 */
  id?: string
  /**@param groupId HTTPFuzzer必须要有的，其他页面可以不用 */
  groupId?: string
  /**@name webFuzzer变量参数 */
  params?: FuzzerParamItem[]
  /**@name webFuzzer提取器参数 */
  extractors?: HTTPResponseExtractor[]

  // Route.Mod_ScanPort 参数
  scanportParams?: string

  // Route.Mod_Brute 参数
  bruteParams?: string
  recoverUid?: string
  recoverBaseProgress?: number

  // Route.PacketScanPage 参数
  packetScan_FlowIds?: number[]
  packetScan_Https?: boolean
  packetScan_HttpRequest?: Uint8Array
  packetScan_Keyword?: string

  // 分享的初始化参数
  shareContent?: string

  // yakit 插件日志详情参数
  YakScriptJournalDetailsId?: number
  // facade server参数
  facadeServerParams?: StartFacadeServerParams
  classGeneraterParams?: { [key: string]: any }
  classType?: string

  // 简易企业版 - 安全检测
  recoverOnlineGroup?: string
  recoverTaskName?: string

  // 数据对比
  leftData?: string
  rightData?: string

  // 编辑插件
  editPluginId?: number

  // webshell info
  webshellInfo?: WebShellDetail
  /**批量执行页面参数 */
  pluginBatchExecutorPageInfo?: PluginBatchExecutorPageInfoProps
  /**专项漏洞页面 */
  pocPageInfo?: PocPageInfoProps
  /**弱口令页面 */
  brutePageInfo?: BrutePageInfoProps
  /**端口扫描页面 */
  scanPortPageInfo?: ScanPortPageInfoProps
  /**空间引擎页面 */
  spaceEnginePageInfo?: SpaceEnginePageInfoProps
  /**简易版 安全检测页面 */
  simpleDetectPageInfo?: SimpleDetectPageInfoProps
  /**webSocket页面 */
  websocketFuzzerPageInfo?: WebsocketFuzzerPageInfoProps
  /**流量分析器页面 */
  hTTPHistoryAnalysisPageInfo?: HTTPHistoryAnalysisPageInfo
  /**新建插件页面 */
  addYakitScriptPageInfo?: AddYakitScriptPageInfoProps
  /**漏洞与风险统计页面 */
  riskPageInfoProps?: RiskPageInfoProps
  /**MITM劫持页面 v1 */
  hTTPHackerPageInfoProps?: HTTPHackerPageInfoProps
  /**代码审计页面 */
  auditCodePageInfo?: AuditCodePageInfoProps
  auditHolePageInfo?: AuditHoleInfoProps
  /**代码扫描页面 */
  codeScanPageInfo?: CodeScanPageInfoProps
  /**记事本编辑页面 */
  modifyNotepadPageInfo?: ModifyNotepadPageInfoProps
  /** hTTPHacker v2 新版 */
  mitmHackerPageInfo?: MITMHackerPageInfoProps

  /** 快捷键配置页面信息 */
  shortcutKeyPage?: ShortcutKeyPageName

  /** 编辑 forge 模板 */
  modifyAIForgePageInfo?: AIForgeEditorPageInfoProps
  /** 新增 ai-forge 模板页面 */
  addAIForgePageInfo?: AIForgeEditorPageInfoProps
  /** 编辑 ai tool 页面 */
  modifyAIToolPageInfo?: AIToolEditorPageInfoProps

  /** 新增 ai tool 页面 */
  addAIToolPageInfo?: AIToolEditorPageInfoProps
  /** 扫描历史页面 */
  yakRunnerScanHistoryPageInfo?: YakRunnerScanHistoryPageInfoProps
  /** 规则管理页面 */
  ruleManagementPageInfo?: RuleManagementPageInfoProps

  // TODO  后续补充
  AIRepository?: AIRepositoryProps
}
function withRouteToPage(WrappedComponent) {
  return function WithPage(props) {
    return (
      <ErrorBoundary
        FallbackComponent={({ error, resetErrorBoundary }) => {
          if (!error) {
            return <div>Unknown error</div>
          }
          return (
            <div style={{ padding: '20px', fontFamily: 'monospace' }}>
              <h3>Page Error</h3>
              <p>A logic error occurred. Please close this page and try again.</p>
              <div style={{ marginTop: '16px' }}>
                <h4>Error Message:</h4>
                <pre
                  style={{
                    background: 'var(--Colors-Use-Neutral-Bg)',
                    padding: '8px',
                    borderRadius: '4px',
                  }}
                >
                  {error?.message}
                </pre>
              </div>
              <div style={{ marginTop: '16px' }}>
                <h4>Stack Trace:</h4>
                <pre
                  style={{
                    background: 'var(--Colors-Use-Neutral-Bg)',
                    padding: '8px',
                    borderRadius: '4px',
                    maxHeight: '300px',
                    overflow: 'auto',
                    fontSize: '12px',
                  }}
                >
                  {error?.stack || 'No stack trace available'}
                </pre>
              </div>
              <div style={{ marginTop: '16px' }}>
                <h4>Component Info:</h4>
                <pre
                  style={{
                    background: 'var(--Colors-Use-Neutral-Bg)',
                    padding: '8px',
                    borderRadius: '4px',
                  }}
                >
                  Component Name: {WrappedComponent?.name || WrappedComponent?.displayName || 'Unknown Component'}
                </pre>
              </div>
              <div style={{ marginTop: '16px' }}>
                <h4>Props:</h4>
                <pre
                  style={{
                    background: 'var(--Colors-Use-Neutral-Bg)',
                    padding: '8px',
                    borderRadius: '4px',
                    maxHeight: '200px',
                    overflow: 'auto',
                    fontSize: '12px',
                  }}
                >
                  {JSON.stringify(props, null, 2)}
                </pre>
              </div>
              <button
                onClick={resetErrorBoundary}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  background: 'var(--Colors-Use-Blue-Primary)',
                  color: 'var(--Colors-Use-Blue-On-Primary)',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
            </div>
          )
        }}
      >
        <WrappedComponent {...props} />
      </ErrorBoundary>
    )
  }
}

export const RouteToPage: (props: PageItemProps) => ReactNode = (props) => {
  const { routeKey, yakScriptId, params } = props
  switch (routeKey) {
    case YakitRoute.NewHome:
      return <>{isIRify() ? <IRifyHome /> : <Home />}</>
    case YakitRoute.HTTPHacker:
      return (
        <Suspense fallback={<PageLoading />}>
          <HTTPHacker />
        </Suspense>
      )
    case YakitRoute.MITMHacker:
      return (
        <Suspense fallback={<PageLoading />}>
          <MITMHacker />
        </Suspense>
      )
    case YakitRoute.HTTPFuzzer:
      return (
        <Suspense fallback={<PageLoading />}>
          <WebFuzzerPage defaultType="config" id={params?.id || ''}>
            <HTTPFuzzerPage system={params?.system} id={params?.id || ''} />
          </WebFuzzerPage>
        </Suspense>
      )
    case YakitRoute.WebsocketFuzzer:
      return <WebsocketFuzzer pageId={params?.id || ''} />
    case YakitRoute.Codec:
      return <NewCodec id={params?.id || ''} />
    case YakitRoute.DataCompare:
      return <DataCompare leftData={params?.leftData} rightData={params?.rightData} />
    case YakitRoute.Mod_ScanPort:
      return <NewPortScan id={params?.id || ''} />
    case YakitRoute.PoC:
      return <YakPoC pageId={params?.id || ''} />
    case YakitRoute.Plugin_OP:
      if (!yakScriptId || !+yakScriptId) return <div />
      return <SinglePluginExecution yakScriptId={yakScriptId || 0} />
    case YakitRoute.Mod_Brute:
      return <NewBrute id={params?.id || ''} />
    case YakitRoute.Plugin_Hub:
      return (
        <Suspense fallback={<PageLoading />}>
          <PluginHub />
        </Suspense>
      )
    case YakitRoute.BatchExecutorPage:
      return <PluginBatchExecutor id={params?.id || ''} />
    case YakitRoute.DNSLog:
      return <DNSLogPage />
    case YakitRoute.ICMPSizeLog:
      return <ICMPSizeLoggerPage />
    case YakitRoute.TCPPortLog:
      return <RandomPortLogPage />
    case YakitRoute.PayloadGenerater_New:
      return <JavaPayloadPage />
    case YakitRoute.ReverseServer_New:
      return <NewReverseServerPage />
    case YakitRoute.ShellReceiver:
      return <ShellReceiver />
    case YakitRoute.DB_HTTPHistory:
      return <HTTPHistory pageType="History" />
    case YakitRoute.DB_HTTPHistoryAnalysis:
      return <HTTPHistoryAnalysis pageId={params?.id || ''} />
    case YakitRoute.DB_Report:
      return <ReportViewerPage />
    case YakitRoute.DB_Risk:
      return <RiskPage />
    case YakitRoute.Misstatement:
      return <Misstatement />
    case YakitRoute.DB_Ports:
      return <PortAssetTable />
    case YakitRoute.DB_Domain:
      return <DomainAssetPage />
    case YakitRoute.DB_CVE:
      return <CVEViewer />
    case YakitRoute.YakScript:
      return <YakRunner />
    case YakitRoute.PayloadManager:
      return <NewPayload />
    case YakitRoute.ConfigManagement:
      return <ConfigManagement />
    case YakitRoute.AccountAdminPage:
      return <AccountAdminPage />
    case YakitRoute.RoleAdminPage:
      return <RoleAdminPage />
    case YakitRoute.HoleCollectPage:
      return <HoleCollectPage />
    case YakitRoute.LicenseAdminPage:
      return <LicenseAdminPage />
    case YakitRoute.TrustListPage:
      return <TrustListPage />
    case YakitRoute.ControlAdminPage:
      return <ControlAdminPage />
    case YakitRoute.AddYakitScript:
      return <AddYakitPlugin />
    case YakitRoute.SimpleDetect:
      return <SimpleDetect pageId={params?.id || ''} />
    case YakitRoute.ScreenRecorderPage:
      return <ScreenRecorderPage />
    case YakitRoute.DB_ChaosMaker:
      return <ChaosMakerPage />
    case YakitRoute.Beta_DebugTrafficAnalize:
      return <PcapXDemo />
    case YakitRoute.Beta_DebugMonacoEditor:
      return <DebugMonacoEditorPage />
    case YakitRoute.Beta_VulinboxManager:
      return <VulinboxManager />
    case YakitRoute.Beta_DiagnoseNetwork:
      return <DiagnoseNetworkPage />
    case YakitRoute.Beta_ConfigNetwork:
      return <ConfigNetworkPage />
    case YakitRoute.Plugin_Audit:
      return (
        <OnlineJudgment isJudgingLogin={true}>
          <PluginManage />
        </OnlineJudgment>
      )
    case YakitRoute.Beta_WebShellManager:
      return <WebShellViewer />
    case YakitRoute.Beta_WebShellOpt:
      return <WebShellDetailOpt id={(params?.id || '') + ''} webshellInfo={params?.webshellInfo as WebShellDetail} />
    case YakitRoute.Data_Statistics:
      return <DataStatistics />
    case YakitRoute.Space_Engine:
      return <SpaceEnginePage pageId={params?.id || ''} />
    case YakitRoute.YakRunner_Code_Scan:
      return <YakRunnerCodeScan pageId={params?.id || ''} />
    case YakitRoute.YakRunner_Audit_Code:
      return <YakRunnerAuditCode auditCodePageInfo={params?.auditCodePageInfo} />
    case YakitRoute.Irify_AI_Code_Audit:
      return <IrifyAiCodeAuditPage auditCodePageInfo={params?.auditCodePageInfo} />
    case YakitRoute.YakRunner_Project_Manager:
      return <YakRunnerProjectManager />
    case YakitRoute.YakRunner_ScanHistory:
      return <YakRunnerScanHistory />
    case YakitRoute.SSA_Compile_History:
      return <SSACompileHistory />
    case YakitRoute.Rule_Management:
      return <RuleManagement ruleManagementPageInfo={params?.ruleManagementPageInfo} />
    case YakitRoute.Notepad_Manage:
      return <NotepadManage />
    case YakitRoute.Modify_Notepad:
      return <ModifyNotepad pageId={params?.id || ''} />
    case YakitRoute.YakRunner_Audit_Hole:
      return <YakRunnerAuditHole />
    case YakitRoute.System_Config:
      return <SystemConfig />
    case YakitRoute.Yak_Java_Decompiler:
      return <YakJavaDecompiler />
    case YakitRoute.AI_Agent:
      return <AIAgent pageId={params?.id || ''} />
    case YakitRoute.ShortcutKey:
      return <ShortcutKeyList />
    case YakitRoute.FingerprintManage:
      return <FingerprintManage />
    case YakitRoute.Ssa_Result_Diff:
      return <SsaResDiff />
    case YakitRoute.AI_REPOSITORY:
      return <KnowledgeBase />
    case YakitRoute.AddAIForge:
      return <ForgeEditor />
    case YakitRoute.ModifyAIForge:
      return <ForgeEditor isModify={true} />

    case YakitRoute.AddAITool:
      return <AIToolEditor pageId={params?.id || ''} />
    case YakitRoute.ModifyAITool:
      return <AIToolEditor pageId={params?.id || ''} isModify={true} />
    case YakitRoute.AI_Memory:
      return <MemoryBase pageId={params?.id || ''} />
    case YakitRoute.AI_Tool:
      return <AITool pageId={params?.id || ''} />
    case YakitRoute.AI_Forge:
      return <AIForge pageId={params?.id || ''} />
    default:
      return <div />
  }
}

export const RouteToPageItem = withRouteToPage(RouteToPage)

/** @name 菜单中内定插件的插件名称(不是展示名称) */
export enum ResidentPluginName {
  SubDomainCollection = '子域名收集',
  BasicCrawler = '基础爬虫',
  DirectoryScanning = '综合目录扫描与爆破',
}

/** @name 数据库一级菜单项属性 */
export interface DatabaseFirstMenuProps {
  /** @name 一级菜单展示名 */
  Group: string
  /** @name 二级菜单项集合 */
  Items: DatabaseSecondMenuProps[]
  /** @name 一级菜单顺序位 */
  GroupSort: number
  /** @name 菜单模式 */
  Mode: string
  /** @name 一级菜单初始值 */
  GroupLabel: string
}
/** @name 数据库二级菜单项属性 */
export interface DatabaseSecondMenuProps {
  /** @name 插件id */
  YakScriptId: number
  /** @name 插件名称 */
  YakScriptName: string
  /** @name 插件头像 */
  HeadImg?: string
  /** @name 菜单模式 */
  Mode: string
  /** @name 二级菜单顺序位 */
  VerboseSort: number
  /** @name 一级菜单顺序位 */
  GroupSort: number
  /** @name 二级菜单路由 */
  Route: string
  /** @name 二级菜单展示名 */
  Verbose: string
  /** @name 二级菜单初始值 */
  VerboseLabel: string
  /** @name 一级菜单展示名 */
  Group: string
  /** @name 一级菜单初始值 */
  GroupLabel: string
}
/**
 * @name 数据库转化的前端数据属性
 * @param route 菜单路由
 * @param label 菜单显示名称
 * @param menuName 菜单代码名(前端代码中定义的名)
 * @param pluginId 插件id
 * @param pluginName 插件名称
 * @param children 子集
 */
export interface DatabaseMenuItemProps {
  route: YakitRoute | undefined
  label: string
  menuName: string
  pluginId: number
  pluginName: string
  HeadImg?: string
  children?: DatabaseMenuItemProps[]
}
/** @name 数据库菜单数据转换为前端数据 */
export const databaseConvertData = (data: DatabaseFirstMenuProps[]) => {
  const menus: DatabaseMenuItemProps[] = []
  for (let item of data) {
    const menu: DatabaseMenuItemProps = {
      route: undefined,
      label: item.Group,
      menuName: item.GroupLabel || item.Group,
      pluginId: 0,
      pluginName: '',
      children: [],
    }
    if (item.Items && item.Items.length > 0) {
      for (let subItem of item.Items) {
        const subMenu: DatabaseMenuItemProps = {
          route: subItem.Route as YakitRoute,
          label: subItem.Verbose,
          menuName: subItem.VerboseLabel || subItem.YakScriptName || subItem.Verbose,
          pluginId: +subItem.YakScriptId || 0,
          pluginName: subItem.YakScriptName || '',
          HeadImg: subItem.HeadImg || undefined,
        }
        menu.children?.push(subMenu)
      }
    } else {
      menu.children = undefined
    }
    menus.push(menu)
  }
  return menus
}

/** public版菜单项属性 */
export interface PublicRouteMenuProps {
  page: YakitRoute | undefined
  label: string
  labelUi?: string
  describe?: string
  describeUi?: string
  yakScriptId?: number
  yakScripName?: string
  children?: PublicRouteMenuProps[]
}

/**
 * @name public版菜单配置数据
 * @description 注意! 该数据只在折叠菜单时使用，展开菜单的渲染并未使用该数据，如需调整展开菜单，请在组件MenuMode内修改
 */
export const getPublicRouteMenu = (softMode: SoftMode) => {
  if (isIRify()) {
    return [
      {
        page: undefined,
        label: 'Code Audit',
        labelUi: 'YakitRoute.codeAudit',
        children: [
          {
            page: YakitRoute.YakRunner_Project_Manager,
            ...YakitRouteToPageInfo[YakitRoute.YakRunner_Project_Manager],
          },
          {
            page: YakitRoute.YakRunner_Audit_Code,
            ...YakitRouteToPageInfo[YakitRoute.YakRunner_Audit_Code],
          },
          {
            page: YakitRoute.Irify_AI_Code_Audit,
            ...YakitRouteToPageInfo[YakitRoute.Irify_AI_Code_Audit],
          },
          {
            page: YakitRoute.YakRunner_Code_Scan,
            ...YakitRouteToPageInfo[YakitRoute.YakRunner_Code_Scan],
          },
          {
            page: YakitRoute.Rule_Management,
            ...YakitRouteToPageInfo[YakitRoute.Rule_Management],
          },
          {
            page: YakitRoute.YakRunner_Audit_Hole,
            ...YakitRouteToPageInfo[YakitRoute.YakRunner_Audit_Hole],
          },
          {
            page: YakitRoute.Yak_Java_Decompiler,
            ...YakitRouteToPageInfo[YakitRoute.Yak_Java_Decompiler],
          },
        ],
      },
      {
        page: undefined,
        label: 'Database',
        labelUi: 'YakitRoute.database',
        children: [{ page: YakitRoute.DB_Report, ...YakitRouteToPageInfo[YakitRoute.DB_Report] }],
      },
    ]
  }
  if (isMemfit())
    return [
      {
        page: YakitRoute.AI_Agent,
        ...YakitRouteToPageInfo[YakitRoute.AI_Agent],
      },
      { page: YakitRoute.AI_REPOSITORY, ...YakitRouteToPageInfo[YakitRoute.AI_REPOSITORY] },
      { page: YakitRoute.AI_Memory, ...YakitRouteToPageInfo[YakitRoute.AI_Memory] },
      { page: YakitRoute.AI_Tool, ...YakitRouteToPageInfo[YakitRoute.AI_Tool] },
      { page: YakitRoute.AI_Forge, ...YakitRouteToPageInfo[YakitRoute.AI_Forge] },
      {
        page: YakitRoute.Plugin_Hub,
        ...YakitRouteToPageInfo[YakitRoute.Plugin_Hub],
      },
      {
        page: undefined,
        label: 'Database',
        labelUi: 'YakitRoute.database',
        children: [
          {
            page: YakitRoute.DB_HTTPHistory,
            ...YakitRouteToPageInfo[YakitRoute.DB_HTTPHistory],
          },
          { page: YakitRoute.DB_Report, ...YakitRouteToPageInfo[YakitRoute.DB_Report] },
          { page: YakitRoute.DB_Risk, ...YakitRouteToPageInfo[YakitRoute.DB_Risk] },
          { page: YakitRoute.DB_Ports, ...YakitRouteToPageInfo[YakitRoute.DB_Ports] },
          { page: YakitRoute.DB_Domain, ...YakitRouteToPageInfo[YakitRoute.DB_Domain] },
          { page: YakitRoute.FingerprintManage, ...YakitRouteToPageInfo[YakitRoute.FingerprintManage] },
          { page: YakitRoute.DB_CVE, ...YakitRouteToPageInfo[YakitRoute.DB_CVE] },
        ],
      },
    ]
  if (isYakit()) {
    if (isCommunityYakit()) {
      // 经典模式
      if (softMode === YakitModeEnum.Classic) {
        return [
          {
            page: undefined,
            label: 'Penetration Testing',
            labelUi: 'YakitRoute.penTest',
            children: [
              {
                page: YakitRoute.MITMHacker,
                ...YakitRouteToPageInfo[YakitRoute.MITMHacker],
              },
              {
                page: undefined,
                label: 'Fuzzer',
                labelUi: 'YakitRoute.fuzzer',
                children: [
                  {
                    page: YakitRoute.HTTPFuzzer,
                    ...YakitRouteToPageInfo[YakitRoute.HTTPFuzzer],
                  },
                  {
                    page: YakitRoute.WebsocketFuzzer,
                    ...YakitRouteToPageInfo[YakitRoute.WebsocketFuzzer],
                  },
                ],
              },
              { page: YakitRoute.Codec, ...YakitRouteToPageInfo[YakitRoute.Codec] },
              {
                page: YakitRoute.DataCompare,
                ...YakitRouteToPageInfo[YakitRoute.DataCompare],
              },
            ],
          },
          {
            page: undefined,
            label: 'Security Tools',
            labelUi: 'YakitRoute.securityTools',
            children: [
              {
                page: YakitRoute.Mod_ScanPort,
                ...YakitRouteToPageInfo[YakitRoute.Mod_ScanPort],
              },
              { page: YakitRoute.PoC, ...YakitRouteToPageInfo[YakitRoute.PoC] },
              {
                page: YakitRoute.Plugin_OP,
                label: 'Subdomain Collection',
                labelUi: 'YakitRoute.subdomainCollection',
                yakScripName: ResidentPluginName.SubDomainCollection,
              },
              {
                page: YakitRoute.Plugin_OP,
                label: 'Basic Crawler',
                labelUi: 'YakitRoute.basicCrawler',
                yakScripName: ResidentPluginName.BasicCrawler,
              },
              { page: YakitRoute.Space_Engine, ...YakitRouteToPageInfo[YakitRoute.Space_Engine] },
              {
                page: undefined,
                label: 'Brute Force & Unauthorized Check',
                labelUi: 'YakitRoute.bruteForceAndUnauthorizedCheck',
                children: [
                  {
                    page: YakitRoute.Mod_Brute,
                    ...YakitRouteToPageInfo[YakitRoute.Mod_Brute],
                  },
                  {
                    page: YakitRoute.Plugin_OP,
                    label: 'Directory Scan',
                    labelUi: 'YakitRoute.directoryScan',
                    yakScripName: ResidentPluginName.DirectoryScanning,
                  },
                ],
              },
            ],
          },
          {
            page: undefined,
            label: 'Plugins',
            labelUi: 'YakitRoute.plugin',
            children: [
              {
                page: YakitRoute.Plugin_Hub,
                ...YakitRouteToPageInfo[YakitRoute.Plugin_Hub],
              },
              {
                page: YakitRoute.BatchExecutorPage,
                ...YakitRouteToPageInfo[YakitRoute.BatchExecutorPage],
              },
            ],
          },
          {
            page: undefined,
            label: 'Reverse Connection',
            labelUi: 'YakitRoute.reverseConnection',
            children: [
              {
                page: undefined,
                label: 'Reverse Triggers',
                labelUi: 'YakitRoute.reverseTrigger',
                children: [
                  {
                    page: YakitRoute.DNSLog,
                    ...YakitRouteToPageInfo[YakitRoute.DNSLog],
                  },
                  {
                    page: YakitRoute.ICMPSizeLog,
                    ...YakitRouteToPageInfo[YakitRoute.ICMPSizeLog],
                  },
                  {
                    page: YakitRoute.TCPPortLog,
                    ...YakitRouteToPageInfo[YakitRoute.TCPPortLog],
                  },
                ],
              },
              {
                page: undefined,
                label: 'RevHack',
                labelUi: 'YakitRoute.revHack',
                children: [
                  {
                    page: YakitRoute.PayloadGenerater_New,
                    ...YakitRouteToPageInfo[YakitRoute.PayloadGenerater_New],
                  },
                  {
                    page: YakitRoute.ReverseServer_New,
                    ...YakitRouteToPageInfo[YakitRoute.ReverseServer_New],
                  },
                ],
              },
              {
                page: YakitRoute.ShellReceiver,
                ...YakitRouteToPageInfo[YakitRoute.ShellReceiver],
              },
            ],
          },
          {
            page: undefined,
            label: 'Database',
            labelUi: 'YakitRoute.database',
            children: [
              {
                page: YakitRoute.DB_HTTPHistory,
                ...YakitRouteToPageInfo[YakitRoute.DB_HTTPHistory],
              },
              { page: YakitRoute.DB_Report, ...YakitRouteToPageInfo[YakitRoute.DB_Report] },
              { page: YakitRoute.DB_Risk, ...YakitRouteToPageInfo[YakitRoute.DB_Risk] },
              { page: YakitRoute.DB_Ports, ...YakitRouteToPageInfo[YakitRoute.DB_Ports] },
              { page: YakitRoute.DB_Domain, ...YakitRouteToPageInfo[YakitRoute.DB_Domain] },
              { page: YakitRoute.FingerprintManage, ...YakitRouteToPageInfo[YakitRoute.FingerprintManage] },
              { page: YakitRoute.DB_CVE, ...YakitRouteToPageInfo[YakitRoute.DB_CVE] },
            ],
          },
        ]
      }
      // 安全专家模式
      if (softMode === YakitModeEnum.SecurityExpert) {
        return []
      }
      // 扫描模式
      if (softMode === YakitModeEnum.Scan) {
        return [
          {
            page: undefined,
            label: 'Security Tools',
            labelUi: 'YakitRoute.securityTools',
            children: [
              {
                page: YakitRoute.Mod_ScanPort,
                ...YakitRouteToPageInfo[YakitRoute.Mod_ScanPort],
              },
              { page: YakitRoute.PoC, ...YakitRouteToPageInfo[YakitRoute.PoC] },
              {
                page: YakitRoute.Plugin_OP,
                label: 'Subdomain Collection',
                labelUi: 'YakitRoute.subdomainCollection',
                yakScripName: ResidentPluginName.SubDomainCollection,
              },
              {
                page: YakitRoute.Plugin_OP,
                label: 'Basic Crawler',
                labelUi: 'YakitRoute.basicCrawler',
                yakScripName: ResidentPluginName.BasicCrawler,
              },
              { page: YakitRoute.Space_Engine, ...YakitRouteToPageInfo[YakitRoute.Space_Engine] },
              {
                page: undefined,
                label: 'Brute Force & Unauthorized Check',
                labelUi: 'YakitRoute.bruteForceAndUnauthorizedCheck',
                children: [
                  {
                    page: YakitRoute.Mod_Brute,
                    ...YakitRouteToPageInfo[YakitRoute.Mod_Brute],
                  },
                  {
                    page: YakitRoute.Plugin_OP,
                    label: 'Directory Scan',
                    labelUi: 'YakitRoute.directoryScan',
                    yakScripName: ResidentPluginName.DirectoryScanning,
                  },
                ],
              },
            ],
          },
          {
            page: undefined,
            label: 'Penetration Testing',
            labelUi: 'YakitRoute.penTest',
            children: [
              {
                page: YakitRoute.MITMHacker,
                ...YakitRouteToPageInfo[YakitRoute.MITMHacker],
              },
              {
                page: undefined,
                label: 'Fuzzer',
                labelUi: 'YakitRoute.fuzzer',
                children: [
                  {
                    page: YakitRoute.HTTPFuzzer,
                    ...YakitRouteToPageInfo[YakitRoute.HTTPFuzzer],
                  },
                  {
                    page: YakitRoute.WebsocketFuzzer,
                    ...YakitRouteToPageInfo[YakitRoute.WebsocketFuzzer],
                  },
                ],
              },
              { page: YakitRoute.Codec, ...YakitRouteToPageInfo[YakitRoute.Codec] },
              {
                page: YakitRoute.DataCompare,
                ...YakitRouteToPageInfo[YakitRoute.DataCompare],
              },
            ],
          },
          {
            page: undefined,
            label: 'Plugins',
            labelUi: 'YakitRoute.plugin',
            children: [
              {
                page: YakitRoute.Plugin_Hub,
                ...YakitRouteToPageInfo[YakitRoute.Plugin_Hub],
              },
              {
                page: YakitRoute.BatchExecutorPage,
                ...YakitRouteToPageInfo[YakitRoute.BatchExecutorPage],
              },
            ],
          },
          {
            page: undefined,
            label: 'Database',
            labelUi: 'YakitRoute.database',
            children: [
              {
                page: YakitRoute.DB_HTTPHistory,
                ...YakitRouteToPageInfo[YakitRoute.DB_HTTPHistory],
              },
              { page: YakitRoute.DB_Report, ...YakitRouteToPageInfo[YakitRoute.DB_Report] },
              { page: YakitRoute.DB_Risk, ...YakitRouteToPageInfo[YakitRoute.DB_Risk] },
              { page: YakitRoute.DB_Ports, ...YakitRouteToPageInfo[YakitRoute.DB_Ports] },
              { page: YakitRoute.DB_Domain, ...YakitRouteToPageInfo[YakitRoute.DB_Domain] },
              { page: YakitRoute.FingerprintManage, ...YakitRouteToPageInfo[YakitRoute.FingerprintManage] },
              { page: YakitRoute.DB_CVE, ...YakitRouteToPageInfo[YakitRoute.DB_CVE] },
            ],
          },
        ]
      }
      return []
    }
    return []
  }
  return []
}
/**
 * @name public版常用插件列表
 * @description 注意！该列表内保存的都为插件的名称
 */
export const PublicCommonPlugins: PublicRouteMenuProps[] = [
  {
    page: undefined,
    label: 'Basic Tools',
    children: [
      'web登录页面用户名密码爆破',
      '基础爬虫',
      '字典生成器',
      '无头浏览器模拟点击爬虫',
      '综合目录扫描与爆破',
      'fuzztag表格生成',
      '按行去重',
    ].map((item) => {
      return { page: YakitRoute.Plugin_OP, label: item, yakScripName: item }
    }),
  },
  {
    page: undefined,
    label: 'Subdomain Collection',
    children: ['子域名收集&漏洞扫描', 'IP批量查询', '主动指纹探测', 'ICP备案查询', '瞅一下'].map((item) => {
      return { page: YakitRoute.Plugin_OP, label: item, yakScripName: item }
    }),
  },
]

interface BaseExtraMenuItem {
  /** 路由页，纯分组节点时为 undefined */
  page?: YakitRoute
  /** 显示图标 */
  icon?: ReactNode
  /** 文案（i18n=false 时直接显示） */
  label?: string
  /** i18n key */
  labelUi?: string
  /** 是否启用 i18n（默认 true） */
  i18n?: boolean
  /** 插件类菜单 */
  yakScripName?: string
}
interface ExtraMenuLeaf extends BaseExtraMenuItem {
  page: YakitRoute
  children?: never
}
interface ExtraMenuGroup extends BaseExtraMenuItem {
  page?: undefined
  children: ExtraMenuItem[]
}
export type ExtraMenuItem = ExtraMenuLeaf | ExtraMenuGroup

/** @name 靶场菜单项 */
const getVulinboxMenuItem = (hideIcon = false): ExtraMenuItem => ({
  page: YakitRoute.Beta_VulinboxManager,
  labelUi: 'YakitRoute.range',
  ...(hideIcon ? {} : { icon: <PublicToolVulinboxIcon /> }),
})

/** @name yakit 安全专家模式 左侧菜单 */
export const getSecurityExpertLeftMenu: () => ExtraMenuItem[] = () => {
  return [
    {
      page: YakitRoute.MITMHacker,
      labelUi: 'YakitRoute.openMITM',
    },
    {
      page: YakitRoute.HTTPFuzzer,
      labelUi: 'YakitRoute.newWebFuzzer',
    },
    {
      page: YakitRoute.Codec,
      ...YakitRouteToPageInfo[YakitRoute.Codec],
    },
    {
      page: YakitRoute.DataCompare,
      ...YakitRouteToPageInfo[YakitRoute.DataCompare],
    },
    {
      page: YakitRoute.YakScript,
      ...YakitRouteToPageInfo[YakitRoute.YakScript],
    },
    getVulinboxMenuItem(true),
  ]
}
/** @name yakit 安全专家模式 记事本菜单 */
export const getSecurityExpertNotepadMenu: () => ExtraMenuItem[] = () => {
  return [
    {
      page: YakitRoute.Modify_Notepad,
      i18n: false,
      label: getNotepadNameByEditionMulLang(),
    },
  ]
}
/** @name 右侧额外菜单 */
export const getExtraMenu: (softMode: SoftMode) => ExtraMenuItem[] = (softMode) => {
  if (isIRify()) {
    return [
      {
        page: YakitRoute.Codec,
        icon: <SolidCodecIcon />,
        ...YakitRouteToPageInfo[YakitRoute.Codec],
      },
    ]
  }

  if (isMemfit()) {
    return [
      {
        page: YakitRoute.YakScript,
        icon: <SolidTerminalIcon />,
        ...YakitRouteToPageInfo[YakitRoute.YakScript],
      },
      {
        page: undefined,
        icon: <SolidClipboardlistIcon />,
        i18n: false,
        label: getNotepadNameByEditionMulLang(),
        children: [
          {
            page: YakitRoute.Notepad_Manage,
            i18n: false,
            label: getNotepadManage(),
          },
          {
            page: YakitRoute.Modify_Notepad,
            i18n: false,
            label: getNotepadAdd(),
          },
        ],
      },
    ]
  }

  if (isYakit()) {
    if (isEnpriTrace()) {
      return [
        {
          page: YakitRoute.Codec,
          icon: <SolidCodecIcon />,
          ...YakitRouteToPageInfo[YakitRoute.Codec],
        },
        {
          page: YakitRoute.YakScript,
          icon: <SolidTerminalIcon />,
          ...YakitRouteToPageInfo[YakitRoute.YakScript],
        },
        getVulinboxMenuItem(),
        {
          page: undefined,
          icon: <SolidClipboardlistIcon />,
          i18n: false,
          label: getNotepadNameByEditionMulLang(),
          children: [
            {
              page: YakitRoute.Notepad_Manage,
              i18n: false,
              label: getNotepadManage(),
            },
            {
              page: YakitRoute.Modify_Notepad,
              i18n: false,
              label: getNotepadAdd(),
            },
          ],
        },
      ]
    }
    if (isCommunityYakit()) {
      // 经典模式
      if (softMode === YakitModeEnum.Classic) {
        return [
          {
            page: YakitRoute.Codec,
            icon: <SolidCodecIcon />,
            ...YakitRouteToPageInfo[YakitRoute.Codec],
          },
          {
            page: YakitRoute.YakScript,
            icon: <SolidTerminalIcon />,
            ...YakitRouteToPageInfo[YakitRoute.YakScript],
          },
          getVulinboxMenuItem(),
          {
            page: YakitRoute.Modify_Notepad,
            icon: <SolidClipboardlistIcon />,
            i18n: false,
            label: getNotepadNameByEditionMulLang(),
          },
        ]
      }
      // 安全专家模式
      if (softMode === YakitModeEnum.SecurityExpert) {
        return [
          {
            page: undefined,
            label: 'More',
            labelUi: 'YakitButton.more',
            children: [
              {
                page: YakitRoute.WebsocketFuzzer,
                ...YakitRouteToPageInfo[YakitRoute.WebsocketFuzzer],
              },
              {
                page: YakitRoute.Plugin_Hub,
                ...YakitRouteToPageInfo[YakitRoute.Plugin_Hub],
              },
              {
                page: undefined,
                label: 'Reverse Connection',
                labelUi: 'YakitRoute.reverseConnection',
                children: [
                  {
                    page: YakitRoute.DNSLog,
                    ...YakitRouteToPageInfo[YakitRoute.DNSLog],
                  },
                  {
                    page: YakitRoute.ICMPSizeLog,
                    ...YakitRouteToPageInfo[YakitRoute.ICMPSizeLog],
                  },
                  {
                    page: YakitRoute.TCPPortLog,
                    ...YakitRouteToPageInfo[YakitRoute.TCPPortLog],
                  },
                  {
                    page: YakitRoute.PayloadGenerater_New,
                    ...YakitRouteToPageInfo[YakitRoute.PayloadGenerater_New],
                  },
                  {
                    page: YakitRoute.ReverseServer_New,
                    ...YakitRouteToPageInfo[YakitRoute.ReverseServer_New],
                  },
                  {
                    page: YakitRoute.ShellReceiver,
                    ...YakitRouteToPageInfo[YakitRoute.ShellReceiver],
                  },
                ],
              },
              {
                page: undefined,
                label: 'Security Tools',
                labelUi: 'YakitRoute.securityTools',
                children: [
                  {
                    page: YakitRoute.Mod_ScanPort,
                    ...YakitRouteToPageInfo[YakitRoute.Mod_ScanPort],
                  },
                  { page: YakitRoute.PoC, ...YakitRouteToPageInfo[YakitRoute.PoC] },
                  {
                    page: YakitRoute.Plugin_OP,
                    label: 'Subdomain Collection',
                    labelUi: 'YakitRoute.subdomainCollection',
                    yakScripName: ResidentPluginName.SubDomainCollection,
                  },
                  {
                    page: YakitRoute.Plugin_OP,
                    label: 'Basic Crawler',
                    labelUi: 'YakitRoute.basicCrawler',
                    yakScripName: ResidentPluginName.BasicCrawler,
                  },
                  { page: YakitRoute.Space_Engine, ...YakitRouteToPageInfo[YakitRoute.Space_Engine] },
                  {
                    page: undefined,
                    label: 'Brute Force & Unauthorized Check',
                    labelUi: 'YakitRoute.bruteForceAndUnauthorizedCheck',
                    children: [
                      {
                        page: YakitRoute.Mod_Brute,
                        ...YakitRouteToPageInfo[YakitRoute.Mod_Brute],
                      },
                      {
                        page: YakitRoute.Plugin_OP,
                        label: 'Directory Scan',
                        labelUi: 'YakitRoute.directoryScan',
                        yakScripName: ResidentPluginName.DirectoryScanning,
                      },
                    ],
                  },
                ],
              },
              {
                page: undefined,
                label: 'Database',
                labelUi: 'YakitRoute.database',
                children: [
                  {
                    page: YakitRoute.DB_HTTPHistory,
                    ...YakitRouteToPageInfo[YakitRoute.DB_HTTPHistory],
                  },
                  { page: YakitRoute.DB_Report, ...YakitRouteToPageInfo[YakitRoute.DB_Report] },
                  { page: YakitRoute.DB_Risk, ...YakitRouteToPageInfo[YakitRoute.DB_Risk] },
                  { page: YakitRoute.DB_Ports, ...YakitRouteToPageInfo[YakitRoute.DB_Ports] },
                  { page: YakitRoute.DB_Domain, ...YakitRouteToPageInfo[YakitRoute.DB_Domain] },
                  {
                    page: YakitRoute.FingerprintManage,
                    ...YakitRouteToPageInfo[YakitRoute.FingerprintManage],
                  },
                  { page: YakitRoute.DB_CVE, ...YakitRouteToPageInfo[YakitRoute.DB_CVE] },
                ],
              },
            ],
          },
        ]
      }
      // 扫描模式
      if (softMode === YakitModeEnum.Scan) {
        return [
          {
            page: YakitRoute.Codec,
            icon: <SolidCodecIcon />,
            ...YakitRouteToPageInfo[YakitRoute.Codec],
          },
          {
            page: YakitRoute.DataCompare,
            icon: <PublicToolDataCompareIcon />,
            ...YakitRouteToPageInfo[YakitRoute.DataCompare],
          },
          getVulinboxMenuItem(),
          {
            page: undefined,
            label: 'More',
            labelUi: 'YakitButton.more',
            children: [
              {
                page: undefined,
                label: 'Reverse Connection',
                labelUi: 'YakitRoute.reverseConnection',
                children: [
                  {
                    page: YakitRoute.DNSLog,
                    ...YakitRouteToPageInfo[YakitRoute.DNSLog],
                  },
                  {
                    page: YakitRoute.ICMPSizeLog,
                    ...YakitRouteToPageInfo[YakitRoute.ICMPSizeLog],
                  },
                  {
                    page: YakitRoute.TCPPortLog,
                    ...YakitRouteToPageInfo[YakitRoute.TCPPortLog],
                  },
                  {
                    page: YakitRoute.PayloadGenerater_New,
                    ...YakitRouteToPageInfo[YakitRoute.PayloadGenerater_New],
                  },
                  {
                    page: YakitRoute.ReverseServer_New,
                    ...YakitRouteToPageInfo[YakitRoute.ReverseServer_New],
                  },
                  {
                    page: YakitRoute.ShellReceiver,
                    ...YakitRouteToPageInfo[YakitRoute.ShellReceiver],
                  },
                ],
              },
              {
                page: YakitRoute.YakScript,
                ...YakitRouteToPageInfo[YakitRoute.YakScript],
              },
              {
                page: YakitRoute.Modify_Notepad,
                i18n: false,
                label: getNotepadNameByEditionMulLang(),
              },
            ],
          },
        ]
      }
      return []
    }
    return []
  }
  return []
}

/** private版菜单项属性 */
export interface PrivateRouteMenuProps {
  page: YakitRoute | undefined
  label: string
  labelUi?: string
  icon?: ReactNode
  hoverIcon?: JSX.Element
  describe?: string
  describeUi?: string
  yakScriptId?: number
  yakScripName?: string
  children?: PrivateRouteMenuProps[]
}
/** 软件内定插件菜单的icon */
export const getFixedPluginIcon = (name: string) => {
  switch (name) {
    case '基础爬虫':
      return <PrivateOutlineBasicCrawlerIcon />
    case '子域名收集':
      return <PrivateOutlineSubDomainCollectionIcon />
    case '综合目录扫描与爆破':
      return <PrivateOutlineDirectoryScanningIcon />
    default:
      return <PrivateOutlineDefaultPluginIcon />
  }
}
/** 软件内定插件菜单的hover-icon */
export const getFixedPluginHoverIcon = (name: string) => {
  switch (name) {
    case '基础爬虫':
      return <PrivateSolidBasicCrawlerIcon />
    case '子域名收集':
      return <PrivateSolidSubDomainCollectionIcon />
    case '综合目录扫描与爆破':
      return <PrivateSolidDirectoryScanningIcon />
    default:
      return <PrivateSolidDefaultPluginIcon />
  }
}
/** 软件内定插件菜单的describe */
export const getFixedPluginDescribe = (name: string) => {
  switch (name) {
    case '基础爬虫':
      return '通过爬虫可快速了解网站的整体架构'
    case '子域名收集':
      return ''
    case '综合目录扫描与爆破':
      return '带有内置字典的综合目录扫描与爆破'
    default:
      return ''
  }
}

/**
 * @name 可以配置和展示的菜单项
 * @description 主要使用-编辑菜单中的系统功能列表
 */
export const PrivateAllMenus: Record<string, PrivateRouteMenuProps> = {
  [YakitRoute.MITMHacker]: {
    page: YakitRoute.MITMHacker,
    icon: <PrivateOutlineMitmIcon />,
    hoverIcon: <PrivateSolidMitmIcon />,
    ...YakitRouteToPageInfo[YakitRoute.MITMHacker],
  },
  [YakitRoute.HTTPFuzzer]: {
    page: YakitRoute.HTTPFuzzer,
    icon: <PrivateOutlineWebFuzzerIcon />,
    hoverIcon: <PrivateSolidWebFuzzerIcon />,
    ...YakitRouteToPageInfo[YakitRoute.HTTPFuzzer],
  },
  [YakitRoute.WebsocketFuzzer]: {
    page: YakitRoute.WebsocketFuzzer,
    icon: <PrivateOutlineWebsocketFuzzerIcon />,
    hoverIcon: <PrivateSolidWebsocketFuzzerIcon />,
    ...YakitRouteToPageInfo[YakitRoute.WebsocketFuzzer],
  },
  [YakitRoute.Mod_Brute]: {
    page: YakitRoute.Mod_Brute,
    icon: <PrivateOutlineBruteIcon />,
    hoverIcon: <PrivateSolidBruteIcon />,
    ...YakitRouteToPageInfo[YakitRoute.Mod_Brute],
  },
  [YakitRoute.Mod_ScanPort]: {
    page: YakitRoute.Mod_ScanPort,
    icon: <PrivateOutlineScanPortIcon />,
    hoverIcon: <PrivateSolidScanPortIcon />,
    ...YakitRouteToPageInfo[YakitRoute.Mod_ScanPort],
  },
  [YakitRoute.PoC]: {
    page: YakitRoute.PoC,
    icon: <PrivateOutlinePocIcon />,
    hoverIcon: <PrivateSolidPocIcon />,
    ...YakitRouteToPageInfo[YakitRoute.PoC],
  },
  [YakitRoute.Plugin_Hub]: {
    page: YakitRoute.Plugin_Hub,
    icon: <PrivateOutlinePluginStoreIcon />,
    hoverIcon: <PrivateSolidPluginStoreIcon />,
    ...YakitRouteToPageInfo[YakitRoute.Plugin_Hub],
  },
  [YakitRoute.BatchExecutorPage]: {
    page: YakitRoute.BatchExecutorPage,
    icon: <PrivateOutlineBatchPluginIcon />,
    hoverIcon: <PrivateSolidBatchPluginIcon />,
    ...YakitRouteToPageInfo[YakitRoute.BatchExecutorPage],
  },
  [YakitRoute.ShellReceiver]: {
    page: YakitRoute.ShellReceiver,
    icon: <PrivateOutlineShellReceiverIcon />,
    hoverIcon: <PrivateSolidShellReceiverIcon />,
    ...YakitRouteToPageInfo[YakitRoute.ShellReceiver],
  },
  [YakitRoute.ReverseServer_New]: {
    page: YakitRoute.ReverseServer_New,
    icon: <PrivateOutlineReverseServerIcon />,
    hoverIcon: <PrivateSolidReverseServerIcon />,
    ...YakitRouteToPageInfo[YakitRoute.ReverseServer_New],
  },
  [YakitRoute.DNSLog]: {
    page: YakitRoute.DNSLog,
    icon: <PrivateOutlineDNSLogIcon />,
    hoverIcon: <PrivateSolidDNSLogIcon />,
    ...YakitRouteToPageInfo[YakitRoute.DNSLog],
  },
  [YakitRoute.ICMPSizeLog]: {
    page: YakitRoute.ICMPSizeLog,
    icon: <PrivateOutlineICMPSizeLogIcon />,
    hoverIcon: <PrivateSolidICMPSizeLogIcon />,
    ...YakitRouteToPageInfo[YakitRoute.ICMPSizeLog],
  },
  [YakitRoute.TCPPortLog]: {
    page: YakitRoute.TCPPortLog,
    icon: <PrivateOutlineTCPPortLogIcon />,
    hoverIcon: <PrivateSolidTCPPortLogIcon />,
    ...YakitRouteToPageInfo[YakitRoute.TCPPortLog],
  },
  [YakitRoute.PayloadGenerater_New]: {
    page: YakitRoute.PayloadGenerater_New,
    icon: <PrivateOutlinePayloadGeneraterIcon />,
    hoverIcon: <PrivateSolidPayloadGeneraterIcon />,
    ...YakitRouteToPageInfo[YakitRoute.PayloadGenerater_New],
  },
  [YakitRoute.Codec]: {
    page: YakitRoute.Codec,
    icon: <PrivateOutlineCodecIcon />,
    hoverIcon: <PrivateSolidCodecIcon />,
    ...YakitRouteToPageInfo[YakitRoute.Codec],
  },
  [YakitRoute.DataCompare]: {
    page: YakitRoute.DataCompare,
    icon: <PrivateOutlineDataCompareIcon />,
    hoverIcon: <PrivateSolidDataCompareIcon />,
    ...YakitRouteToPageInfo[YakitRoute.DataCompare],
  },
  [YakitRoute.YakRunner_Audit_Code]: {
    page: YakitRoute.YakRunner_Audit_Code,
    icon: <PrivateOutlineAuditCodeIcon />,
    hoverIcon: <PrivateSolidAuditCodeIcon />,
    ...YakitRouteToPageInfo[YakitRoute.YakRunner_Audit_Code],
  },
  [YakitRoute.Irify_AI_Code_Audit]: {
    page: YakitRoute.Irify_AI_Code_Audit,
    icon: <PrivateOutlineAIAgentIcon />,
    hoverIcon: <PrivateSolidAIAgentIcon />,
    ...YakitRouteToPageInfo[YakitRoute.Irify_AI_Code_Audit],
  },
  [YakitRoute.YakRunner_Audit_Hole]: {
    page: YakitRoute.YakRunner_Audit_Hole,
    icon: <PrivateOutlineAuditHoleIcon />,
    hoverIcon: <PrivateSolidAuditHoleIcon />,
    ...YakitRouteToPageInfo[YakitRoute.YakRunner_Audit_Hole],
  },
  [YakitRoute.YakRunner_Project_Manager]: {
    page: YakitRoute.YakRunner_Project_Manager,
    icon: <PrivateOutlineProjectManagerIcon />,
    hoverIcon: <PrivateSolidProjectManagerIcon />,
    ...YakitRouteToPageInfo[YakitRoute.YakRunner_Project_Manager],
  },
  [YakitRoute.YakRunner_Code_Scan]: {
    page: YakitRoute.YakRunner_Code_Scan,
    icon: <PrivateOutlineCodeScanIcon />,
    hoverIcon: <PrivateSolidCodeScanIcon />,
    ...YakitRouteToPageInfo[YakitRoute.YakRunner_Code_Scan],
  },
  [YakitRoute.Rule_Management]: {
    page: YakitRoute.Rule_Management,
    icon: <PrivateOutlineRuleManagementIcon />,
    hoverIcon: <PrivateSolidRuleManagementIcon />,
    ...YakitRouteToPageInfo[YakitRoute.Rule_Management],
  },
  [YakitRoute.DB_Report]: {
    page: YakitRoute.DB_Report,
    icon: <PrivateOutlineReportIcon />,
    hoverIcon: <PrivateSolidReportIcon />,
    ...YakitRouteToPageInfo[YakitRoute.DB_Report],
  },
  [YakitRoute.DB_Ports]: {
    page: YakitRoute.DB_Ports,
    icon: <PrivateOutlinePortsIcon />,
    hoverIcon: <PrivateSolidPortsIcon />,
    ...YakitRouteToPageInfo[YakitRoute.DB_Ports],
  },
  [YakitRoute.DB_Risk]: {
    page: YakitRoute.DB_Risk,
    icon: <PrivateOutlineRiskIcon />,
    hoverIcon: <PrivateSolidRiskIcon />,
    ...YakitRouteToPageInfo[YakitRoute.DB_Risk],
  },
  [YakitRoute.DB_Domain]: {
    page: YakitRoute.DB_Domain,
    icon: <PrivateOutlineDomainIcon />,
    hoverIcon: <PrivateSolidDomainIcon />,
    ...YakitRouteToPageInfo[YakitRoute.DB_Domain],
  },
  [YakitRoute.DB_HTTPHistory]: {
    page: YakitRoute.DB_HTTPHistory,
    icon: <PrivateOutlineHTTPHistoryIcon />,
    hoverIcon: <PrivateSolidHTTPHistoryIcon />,
    ...YakitRouteToPageInfo[YakitRoute.DB_HTTPHistory],
  },
  [YakitRoute.FingerprintManage]: {
    page: YakitRoute.FingerprintManage,
    icon: <PrivateOutlineFingerprintManageIcon />,
    hoverIcon: <PrivateSolidFingerprintManageIcon />,
    ...YakitRouteToPageInfo[YakitRoute.FingerprintManage],
  },
  [YakitRoute.DB_CVE]: {
    page: YakitRoute.DB_CVE,
    icon: <PrivateOutlineCVEIcon />,
    hoverIcon: <PrivateSolidCVEIcon />,
    ...YakitRouteToPageInfo[YakitRoute.DB_CVE],
  },
  [YakitRoute.Space_Engine]: {
    page: YakitRoute.Space_Engine,
    icon: <PrivateOutlineSpaceEngineIcon />,
    hoverIcon: <PrivateSolidSpaceEngineIcon />,
    ...YakitRouteToPageInfo[YakitRoute.Space_Engine],
  },
  [YakitRoute.Yak_Java_Decompiler]: {
    page: YakitRoute.Yak_Java_Decompiler,
    icon: <PrivateOutlineAuditHoleIcon />,
    hoverIcon: <PrivateSolidAuditHoleIcon />,
    ...YakitRouteToPageInfo[YakitRoute.Yak_Java_Decompiler],
  },
  // [YakitRoute.AI_Agent]: {
  //     page: YakitRoute.AI_Agent,
  //     icon: <PrivateOutlineAIAgentIcon />,
  //     hoverIcon: <PrivateSolidAIAgentIcon />,
  //     ...YakitRouteToPageInfo[YakitRoute.AI_Agent]
  // }
}
// 通过传入的 YakitRoute数组 快速生成页面数据数组
const routeToChildren: (route: (YakitRoute | ResidentPluginName)[]) => PrivateRouteMenuProps[] = (route) => {
  const menus: PrivateRouteMenuProps[] = []
  for (let name of route) {
    if (PrivateAllMenus[name]) menus.push(PrivateAllMenus[name])
  }
  return menus
}
/**
 * @name 强制删除用户端的无效一级菜单项集合
 * @description 该菜单数据为开发者迭代版本所产生的已消失的一级菜单项
 * @description 每个菜单项由 '|' 字符进行分割
 */
export const InvalidFirstMenuItem = isCommunityEdition()
  ? CommunityDeprecatedFirstMenu.join('|')
  : EnterpriseDeprecatedFirstMenu.join('|')
/**
 * @name 强制删除用户端的无效菜单项集合
 * @description 该菜单数据为开发者迭代版本所产生的已消失的页面菜单项
 * @description 每个菜单项由 '|' 字符进行分割
 */
export const InvalidPageMenuItem = isCommunityEdition()
  ? CommunityDeprecatedSecondMenu.join('|')
  : EnterpriseDeprecatedSecondMenu.join('|')
/**
 * @name private版专家模式菜单配置数据
 * @description 修改只对专家模式有效，别的模式需取对应模式数据进行修改
 */
export const PrivateExpertRouteMenu: PrivateRouteMenuProps[] = isIRify()
  ? [
      {
        page: undefined,
        label: 'Code Audit',
        labelUi: 'YakitRoute.codeAudit',
        children: [
          PrivateAllMenus[YakitRoute.YakRunner_Project_Manager],
          PrivateAllMenus[YakitRoute.YakRunner_Audit_Code],
          PrivateAllMenus[YakitRoute.Irify_AI_Code_Audit],
          PrivateAllMenus[YakitRoute.YakRunner_Code_Scan],
          PrivateAllMenus[YakitRoute.Rule_Management],
          PrivateAllMenus[YakitRoute.YakRunner_Audit_Hole],
          PrivateAllMenus[YakitRoute.Yak_Java_Decompiler],
        ],
      },
      {
        page: undefined,
        label: 'Database',
        labelUi: 'YakitRoute.database',
        children: routeToChildren([YakitRoute.DB_Report]),
      },
      //   {
      //       page: undefined,
      //       label: "AI",
      //       children: routeToChildren([YakitRoute.AI_Agent])
      //   }
    ]
  : [
      {
        page: undefined,
        label: 'Manual Pen Test',
        labelUi: 'YakitRoute.manualPenTest',
        children: routeToChildren([YakitRoute.MITMHacker, YakitRoute.HTTPFuzzer, YakitRoute.WebsocketFuzzer]),
      },
      {
        page: undefined,
        label: 'Security Tools',
        labelUi: 'YakitRoute.securityTools',
        children: [
          PrivateAllMenus[YakitRoute.Mod_Brute],
          {
            page: YakitRoute.Plugin_OP,
            label: 'Basic Crawler',
            icon: getFixedPluginIcon(ResidentPluginName.BasicCrawler),
            hoverIcon: getFixedPluginHoverIcon(ResidentPluginName.BasicCrawler),
            describe: getFixedPluginDescribe(ResidentPluginName.BasicCrawler),
            yakScripName: ResidentPluginName.BasicCrawler,
          },
          PrivateAllMenus[YakitRoute.Space_Engine],
          PrivateAllMenus[YakitRoute.Mod_ScanPort],
          {
            page: YakitRoute.Plugin_OP,
            label: 'Subdomain Collection',
            icon: getFixedPluginIcon(ResidentPluginName.SubDomainCollection),
            hoverIcon: getFixedPluginHoverIcon(ResidentPluginName.SubDomainCollection),
            describe: getFixedPluginDescribe(ResidentPluginName.SubDomainCollection),
            yakScripName: ResidentPluginName.SubDomainCollection,
          },
          {
            page: YakitRoute.Plugin_OP,
            label: 'Directory Scan',
            icon: getFixedPluginIcon(ResidentPluginName.DirectoryScanning),
            hoverIcon: getFixedPluginHoverIcon(ResidentPluginName.DirectoryScanning),
            describe: getFixedPluginDescribe(ResidentPluginName.DirectoryScanning),
            yakScripName: ResidentPluginName.DirectoryScanning,
          },
        ],
      },
      {
        page: undefined,
        label: 'Targeted Vulnerability Scan',
        labelUi: 'YakitRoute.vulnTargetedScan',
        children: routeToChildren([YakitRoute.PoC]),
      },
      {
        page: undefined,
        label: 'Plugins',
        labelUi: 'YakitRoute.plugin',
        children: routeToChildren([YakitRoute.Plugin_Hub, YakitRoute.BatchExecutorPage]),
      },
      {
        page: undefined,
        label: 'Reverse Connection',
        labelUi: 'YakitRoute.reverseConnection',
        children: routeToChildren([
          YakitRoute.ShellReceiver,
          YakitRoute.ReverseServer_New,
          YakitRoute.DNSLog,
          YakitRoute.ICMPSizeLog,
          YakitRoute.TCPPortLog,
          YakitRoute.PayloadGenerater_New,
        ]),
      },
      {
        page: undefined,
        label: 'Data Processing',
        labelUi: 'YakitRoute.dataProcessing',
        children: routeToChildren([YakitRoute.Codec, YakitRoute.DataCompare]),
      },
      {
        page: undefined,
        label: 'Database',
        labelUi: 'YakitRoute.database',
        children: routeToChildren([
          YakitRoute.DB_Report,
          YakitRoute.DB_Ports,
          YakitRoute.DB_Risk,
          YakitRoute.DB_Domain,
          YakitRoute.DB_HTTPHistory,
          YakitRoute.FingerprintManage,
          YakitRoute.DB_CVE,
        ]),
      },
      //   {
      //       page: undefined,
      //       label: "AI",
      //       children: routeToChildren([YakitRoute.AI_Agent])
      //   }
    ]

/**
 * @name private版扫描模式菜单配置数据
 * @description 修改只对扫描模式有效，别的模式需取对应模式数据进行修改
 */
export const PrivateScanRouteMenu: PrivateRouteMenuProps[] = [
  {
    page: undefined,
    label: 'Security Tools',
    labelUi: 'YakitRoute.securityTools',
    children: [
      PrivateAllMenus[YakitRoute.Mod_Brute],
      {
        page: YakitRoute.Plugin_OP,
        label: 'Basic Crawler',
        icon: getFixedPluginIcon(ResidentPluginName.BasicCrawler),
        hoverIcon: getFixedPluginHoverIcon(ResidentPluginName.BasicCrawler),
        describe: getFixedPluginDescribe(ResidentPluginName.BasicCrawler),
        yakScripName: ResidentPluginName.BasicCrawler,
      },
      PrivateAllMenus[YakitRoute.Space_Engine],
      PrivateAllMenus[YakitRoute.Mod_ScanPort],
      {
        page: YakitRoute.Plugin_OP,
        label: 'Subdomain Collection',
        icon: getFixedPluginIcon(ResidentPluginName.SubDomainCollection),
        hoverIcon: getFixedPluginHoverIcon(ResidentPluginName.SubDomainCollection),
        describe: getFixedPluginDescribe(ResidentPluginName.SubDomainCollection),
        yakScripName: ResidentPluginName.SubDomainCollection,
      },
      {
        page: YakitRoute.Plugin_OP,
        label: 'Directory Scan',
        icon: getFixedPluginIcon(ResidentPluginName.DirectoryScanning),
        hoverIcon: getFixedPluginHoverIcon(ResidentPluginName.DirectoryScanning),
        describe: getFixedPluginDescribe(ResidentPluginName.DirectoryScanning),
        yakScripName: ResidentPluginName.DirectoryScanning,
      },
    ],
  },
  {
    page: undefined,
    label: 'Targeted Vulnerability Scan',
    labelUi: 'YakitRoute.vulnTargetedScan',
    children: routeToChildren([YakitRoute.PoC]),
  },
  {
    page: undefined,
    label: 'Plugins',
    labelUi: 'YakitRoute.plugin',
    children: routeToChildren([YakitRoute.Plugin_Hub, YakitRoute.BatchExecutorPage]),
  },
  {
    page: undefined,
    label: 'Data Processing',
    labelUi: 'YakitRoute.dataProcessing',
    children: routeToChildren([YakitRoute.Codec, YakitRoute.DataCompare]),
  },
  {
    page: undefined,
    label: 'Database',
    labelUi: 'YakitRoute.database',
    children: routeToChildren([
      YakitRoute.DB_Report,
      YakitRoute.DB_Ports,
      YakitRoute.DB_Risk,
      YakitRoute.DB_Domain,
      YakitRoute.DB_HTTPHistory,
      YakitRoute.FingerprintManage,
      YakitRoute.DB_CVE,
    ]),
  },
  //   {
  //       page: undefined,
  //       label: "AI",
  //       children: routeToChildren([YakitRoute.AI_Agent])
  //   }
]
/**
 * @name private版简易版菜单配置数据
 * @description !注意 简易版暂时不能进行菜单编辑,开放编辑请参考专家或扫描模式的菜单数据结构
 * @description 修改只对简易版有效，别的模式需取对应模式数据进行修改
 */
export const PrivateSimpleRouteMenu: PrivateRouteMenuProps[] = [
  {
    page: undefined,
    label: 'Security Check',
    labelUi: 'YakitRoute.securityCheck',
    children: [
      {
        page: YakitRoute.SimpleDetect,
        icon: <PrivateOutlinePocIcon />,
        hoverIcon: <PrivateSolidPocIcon />,
        ...YakitRouteToPageInfo[YakitRoute.SimpleDetect],
      },
    ],
  },
  {
    page: undefined,
    label: 'Plugins',
    labelUi: 'YakitRoute.plugin',
    children: [
      {
        page: YakitRoute.Plugin_Hub,
        icon: <PrivateOutlinePluginStoreIcon />,
        hoverIcon: <PrivateSolidPluginStoreIcon />,
        ...YakitRouteToPageInfo[YakitRoute.Plugin_Hub],
      },
      {
        page: YakitRoute.BatchExecutorPage,
        icon: <PrivateOutlineBatchPluginIcon />,
        hoverIcon: <PrivateSolidBatchPluginIcon />,
        ...YakitRouteToPageInfo[YakitRoute.BatchExecutorPage],
      },
    ],
  },
  {
    page: undefined,
    label: 'Database',
    labelUi: 'YakitRoute.database',
    children: [
      {
        page: YakitRoute.DB_Report,
        icon: <PrivateOutlineReportIcon />,
        hoverIcon: <PrivateSolidReportIcon />,
        ...YakitRouteToPageInfo[YakitRoute.DB_Report],
      },
      {
        page: YakitRoute.DB_Ports,
        icon: <PrivateOutlinePortsIcon />,
        hoverIcon: <PrivateSolidPortsIcon />,
        ...YakitRouteToPageInfo[YakitRoute.DB_Ports],
      },
      {
        page: YakitRoute.DB_Risk,
        icon: <PrivateOutlineRiskIcon />,
        hoverIcon: <PrivateSolidRiskIcon />,
        ...YakitRouteToPageInfo[YakitRoute.DB_Risk],
      },
    ],
  },
]
