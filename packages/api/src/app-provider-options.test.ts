import { describe, it, expect } from "vitest";
import { createApiApp } from "./app";
import {
  getCrypto,
  getSshCa,
  getEventBus,
  getAttachmentStore,
  getOAuthOrg,
  getStrictApiKeyAuth,
  getWorkspaceAccessChecker,
  getSessionEnforcer,
  getSessionThrottle,
  getResourceHooks,
  getConnectionHooks,
  type CryptoService,
  type SshCaSigner,
  type EventBus,
  type AttachmentBlobStore,
  type OAuthOrgHandlers,
  type WorkspaceAccessChecker,
  type SessionEnforcer,
  type SessionThrottle,
  type ResourceHooks,
  type ConnectionHooks,
} from "./providers";

describe("createApiApp provider options", () => {
  it("registers provided custom provider options into their provider slots", () => {
    const mockCrypto: CryptoService = {
      encrypt: async () => ({ cipherText: "mock", iv: "mock", tag: "mock" }),
      decrypt: async () => "mock",
    };

    const mockSshCa: SshCaSigner = {
      getPublicKey: async () => Buffer.from("mock_pub"),
      sign: async () => Buffer.from("mock_sig"),
    };

    const mockEventBus: EventBus = {
      publish: async () => {},
      subscribe: () => () => {},
    };

    const mockAttachmentStore: AttachmentBlobStore = {
      put: async () => ({ blobKey: "k", sizeBytes: 1 }),
      get: async () => null,
      delete: async () => {},
      exists: async () => true,
    };

    const mockOAuthOrg: OAuthOrgHandlers = {
      handleAuthorize: async () => new Response("ok"),
      handleCallback: async () => new Response("ok"),
    };

    const mockAccessChecker: WorkspaceAccessChecker = {
      canAccessWorkspaceAsUser: async () => true,
      userIsOrgAdmin: async () => true,
    };

    const mockSessionEnforcer: SessionEnforcer = {
      enforceSession: async () => null,
    };

    const mockSessionThrottle: SessionThrottle = {
      checkThrottle: async () => null,
    };

    const mockResourceHooks: ResourceHooks = {
      onResourceCreate: async () => {},
      onResourceDelete: async () => {},
    };

    const mockConnectionHooks: ConnectionHooks = {
      onConnectionCreate: async () => {},
      onConnectionDelete: async () => {},
    };

    createApiApp(
      { getSession: async () => null },
      {
        crypto: mockCrypto,
        sshCa: mockSshCa,
        eventBus: mockEventBus,
        attachmentStore: mockAttachmentStore,
        oauthOrg: mockOAuthOrg,
        strictApiKeyAuth: true,
        workspaceAccessChecker: mockAccessChecker,
        sessionEnforcer: mockSessionEnforcer,
        sessionThrottle: mockSessionThrottle,
        resourceHooks: mockResourceHooks,
        connectionHooks: mockConnectionHooks,
      },
    );

    expect(getCrypto()).toBe(mockCrypto);
    expect(getSshCa()).toBe(mockSshCa);
    expect(getEventBus()).toBe(mockEventBus);
    expect(getAttachmentStore()).toBe(mockAttachmentStore);
    expect(getOAuthOrg()).toBe(mockOAuthOrg);
    expect(getStrictApiKeyAuth()).toBe(true);
    expect(getWorkspaceAccessChecker()).toBe(mockAccessChecker);
    expect(getSessionEnforcer()).toBe(mockSessionEnforcer);
    expect(getSessionThrottle()).toBe(mockSessionThrottle);
    expect(getResourceHooks()).toBe(mockResourceHooks);
    expect(getConnectionHooks()).toBe(mockConnectionHooks);
  });
});
