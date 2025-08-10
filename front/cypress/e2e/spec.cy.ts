describe("ログインフォームのテスト", () => {
  beforeEach(() => {
    // 各テストの前にログインページにアクセス
    cy.visit("/login");
  });
  it("ログインフォームが表示される", () => {
    // IDセレクタを使用してログインフォームが表示されていることを確認
    cy.get("#loginForm").should("be.visible");

    // name属性を使用してユーザー名入力フィールドの存在を確認
    cy.get('input[name="loginId"]').should("exist");

    // name属性を使用してパスワード入力フィールドの存在を確認
    cy.get('input[name="password"]').should("exist");

    // type属性とテキスト内容を使用してログインボタンを確認
    cy.get("#loginSubmit").contains("ログインする");
  });

  it("有効な認証情報でログインできる", () => {
    // ユーザー名フィールドにテキストを入力
    cy.get('input[name="loginId"]').type("yko");

    // パスワードフィールドにテキストを入力
    cy.get('input[name="password"]').type("yko");

    // ログインボタンをクリック
    cy.get("#loginSubmit").click();

    // ログイン後にダッシュボードページにリダイレクトされることを確認
    // cy.url().should("include", "/mypage");
  });
});
