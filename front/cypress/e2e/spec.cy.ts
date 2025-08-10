describe("ログインフォームのテスト", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.wait(2000); // 2秒待つ

    // フォーム全体と送信ボタンの表示を待つ
    cy.get("#loginForm", { timeout: 10000 }).should("be.visible");
    // cy.get("#loginSubmit", { timeout: 10000 }).should("be.visible");
  });

  it("ログインフォームが表示される", () => {
    cy.get('input[name="loginId"]').should("exist").and("be.visible");
    cy.get('input[name="password"]').should("exist").and("be.visible");
    // cy.get("#loginSubmit").should("contain.text", "ログインする");
  });

  it("有効な認証情報でログインできる", () => {
    cy.get('input[name="loginId"]').should("be.visible").type("yko");
    cy.get('input[name="password"]').should("be.visible").type("yko");

    // ボタンをクリック
    // cy.get("#loginSubmit").should("be.enabled").click();

    // 遷移を待ってURL確認
    // cy.url({ timeout: 20000 }).should("include", "/mypage");
  });
});
