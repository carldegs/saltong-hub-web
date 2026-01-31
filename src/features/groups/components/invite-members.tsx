import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Group } from "../types";
import InviteQRCode from "./invite-qr-code";
import { getRedirectURL } from "@/lib/utils";
import InviteLink from "./invite-link";

export default function InviteMembers(group: Group) {
  const inviteUrl = `${getRedirectURL()}j/${group.inviteCode}`;
  return (
    <Empty className="py-0 md:py-4">
      <EmptyHeader>
        <EmptyTitle>Game KNB?</EmptyTitle>
        <EmptyDescription>
          Invite your{" "}
          <b>
            <i>kapamilya</i>
          </b>{" "}
          or{" "}
          <b>
            <i>dabarkads</i>
          </b>{" "}
          to your group, and start the competition!
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="w-full max-w-sm">
        <InviteQRCode value={inviteUrl} label={group.name} />
        <InviteLink value={inviteUrl} label={group.name} />
      </EmptyContent>
    </Empty>
  );
}
