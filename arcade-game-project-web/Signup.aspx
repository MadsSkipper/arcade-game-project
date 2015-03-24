<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Signup.aspx.cs" Inherits="Signup" %>

<!DOCTYPE html>

<html>
<head runat="server">
    <title></title>
    <link href="Style.css" rel="stylesheet" />
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <h1>Sign up to </h1>
            <b>Username&nbsp;&nbsp;&nbsp; </b><asp:TextBox ID="tbxUsername" runat="server"></asp:TextBox><br /><br />
            <b>email&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </b><asp:TextBox ID="tbxemail" runat="server"></asp:TextBox><br /><br />
            <b>Password&nbsp;&nbsp;&nbsp; </b><asp:TextBox ID="tbxPassword" runat="server"></asp:TextBox><br /><br />
            <asp:Button ID="btnsignup" CssClass="btn" runat="server" Text="Sign up" OnClick="btnsignup_Click" />
        </div>
    </form>
</body>
</html>
