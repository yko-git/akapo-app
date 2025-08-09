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
    cy.get('button[type="submit"]').contains("ログインする");
  });

  it("有効な認証情報でログインできる", () => {
    // ユーザー名フィールドにテキストを入力
    cy.get('input[name="loginId"]').type("test");

    // パスワードフィールドにテキストを入力
    cy.get('input[name="password"]').type("test");

    // ログインボタンをクリック
    cy.get('#loginForm button[type="submit"]').click();

    // ログイン後にダッシュボードページにリダイレクトされることを確認
    cy.url().should("include", "/mypage");
  });
});
