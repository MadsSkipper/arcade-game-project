<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <title></title>
    <link href="Style.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server">
    <div id="Battle">
        <asp:Panel ID="logout" runat="server">
        <div id="login">
            <h1>log in to Battle of the Galaxy</h1>
       <b>Username </b><asp:TextBox ID="tbxuesrnem" runat="server"></asp:TextBox><br /><br />
        <b>Password&nbsp; </b><asp:TextBox ID="tbxparsword" runat="server" TextMode="Password"></asp:TextBox><br />
            <asp:Label ID="lbllog" runat="server" ForeColor="Red"></asp:Label>
        <asp:Button ID="btnloginamd" CssClass="btn" runat="server" Text="log ind" OnClick="btnloginamd_Click"/>
            <br />
            <asp:LinkButton ID="lblSignup" runat="server" OnClick="lblSignup_Click">Sign up</asp:LinkButton>

        </div>
    </asp:Panel>

    </div>
    </form>
</body>
</html>
