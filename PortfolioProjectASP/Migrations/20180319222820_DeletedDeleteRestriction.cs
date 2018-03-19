using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace PortfolioProject.Migrations
{
    public partial class DeletedDeleteRestriction : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Schedule_UserDetails_EmpId",
                table: "Schedule");

            migrationBuilder.DropColumn(
                name: "firstname",
                table: "Schedule");

            migrationBuilder.DropColumn(
                name: "lastname",
                table: "Schedule");

            migrationBuilder.AddForeignKey(
                name: "FK_Schedule_UserDetails_EmpId",
                table: "Schedule",
                column: "EmpId",
                principalTable: "UserDetails",
                principalColumn: "EmpId",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Schedule_UserDetails_EmpId",
                table: "Schedule");

            migrationBuilder.AddColumn<string>(
                name: "firstname",
                table: "Schedule",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "lastname",
                table: "Schedule",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Schedule_UserDetails_EmpId",
                table: "Schedule",
                column: "EmpId",
                principalTable: "UserDetails",
                principalColumn: "EmpId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
